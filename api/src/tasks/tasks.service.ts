import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, TaskStatus } from './entities/task.entity';
import { Project } from '../projects/entities/project.entity';
import { ProjectMember } from '../projects/entities/project-member.entity';
import { TasksGateway } from './tasks.gateway';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    @InjectRepository(Task)
    private readonly tasks: Repository<Task>,
    @InjectRepository(Project)
    private readonly projects: Repository<Project>,
    @InjectRepository(ProjectMember)
    private readonly members: Repository<ProjectMember>,
    private readonly gateway: TasksGateway,
  ) {}

  async create(projectId: string, dto: CreateTaskDto, userId: string): Promise<Task> {
    try {
      const project = await this.projects.findOne({ where: { id: projectId } });
      if (!project) throw new NotFoundException('Project not found');

      await this.checkProjectAccess(projectId, userId);

      const task = this.tasks.create({
        ...dto,
        projectId,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      });

      const saved = await this.tasks.save(task);
      const fullTask = await this.tasks.findOneOrFail({
        where: { id: saved.id },
        relations: ['project', 'assignedTo'],
      });

      this.gateway.emitTaskCreated(projectId, fullTask);
      this.logger.log(`Task created in project ${projectId}`);

      return fullTask;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Create task error: ${error.message}`);
      throw new InternalServerErrorException('Failed to create task');
    }
  }

  async findAll(projectId: string): Promise<Task[]> {
    await this.projects.findOneOrFail({ where: { id: projectId } });

    return this.tasks.find({
      where: { projectId },
      relations: ['assignedTo'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Task> {
    if (!id?.trim()) throw new BadRequestException('Task ID is required');

    const task = await this.tasks.findOne({
      where: { id },
      relations: ['project', 'assignedTo'],
    });

    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async update(id: string, dto: UpdateTaskDto, userId: string): Promise<Task> {
    try {
      const task = await this.findOne(id);
      await this.checkProjectAccess(task.projectId, userId);

      const oldAssignee = task.assignedToId;

      Object.assign(task, {
        ...dto,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : task.dueDate,
      });

      const updated = await this.tasks.save(task);
      const fullTask = await this.findOne(id);

      this.gateway.emitTaskUpdated(task.projectId, fullTask);

      if (oldAssignee !== dto.assignedToId && dto.assignedToId) {
        this.gateway.emitTaskAssigned(task.projectId, id, dto.assignedToId);
      }

      this.logger.log(`Task ${id} updated`);
      return fullTask;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      this.logger.error(`Update task error: ${error.message}`);
      throw new InternalServerErrorException('Failed to update task');
    }
  }

  async delete(id: string, userId: string): Promise<{ message: string }> {
    try {
      const task = await this.findOne(id);
      await this.checkProjectAccess(task.projectId, userId);

      const projectId = task.projectId;
      await this.tasks.remove(task);

      this.gateway.emitTaskDeleted(projectId, id);
      this.logger.log(`Task ${id} deleted`);

      return { message: 'Task deleted' };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      this.logger.error(`Delete task error: ${error.message}`);
      throw new InternalServerErrorException('Failed to delete task');
    }
  }

  async getProjectTasks(projectId: string): Promise<Task[]> {
    return this.tasks.find({
      where: { projectId },
      relations: ['assignedTo'],
      order: { priority: 'DESC', dueDate: 'ASC' },
    });
  }

  async getUserTasks(userId: string): Promise<Task[]> {
    return this.tasks.find({
      where: { assignedToId: userId },
      relations: ['project', 'assignedTo'],
      order: { dueDate: 'ASC' },
    });
  }

  async changeStatus(id: string, status: TaskStatus, userId: string): Promise<Task> {
    try {
      const task = await this.findOne(id);
      await this.checkProjectAccess(task.projectId, userId);

      task.status = status;
      await this.tasks.save(task);

      const fullTask = await this.findOne(id);
      this.gateway.emitTaskStatusChanged(task.projectId, id, status);

      this.logger.log(`Task ${id} status changed to ${status}`);
      return fullTask;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      this.logger.error(`Change status error: ${error.message}`);
      throw new InternalServerErrorException('Failed to change task status');
    }
  }

  async markComplete(id: string, userId: string): Promise<Task> {
    return this.changeStatus(id, TaskStatus.COMPLETED, userId);
  }

  async markInProgress(id: string, userId: string): Promise<Task> {
    return this.changeStatus(id, TaskStatus.IN_PROGRESS, userId);
  }

  async getTasksByStatus(projectId: string, status: TaskStatus): Promise<Task[]> {
    return this.tasks.find({
      where: { projectId, status },
      relations: ['assignedTo'],
      order: { priority: 'DESC', dueDate: 'ASC' },
    });
  }

  async getOverdueTasks(projectId: string): Promise<Task[]> {
    const now = new Date();
    return this.tasks.find({
      where: {
        projectId,
        dueDate: new Date(now.getTime() - 24 * 60 * 60 * 1000),
      },
      relations: ['assignedTo'],
    });
  }

  private async checkProjectAccess(projectId: string, userId: string): Promise<void> {
    const member = await this.members.findOne({
      where: { projectId, userId },
    });

    if (!member) {
      throw new ForbiddenException('Access denied');
    }
  }
}
