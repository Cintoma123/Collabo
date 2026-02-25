import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AddProjectMemberDto } from './dto/add-project-member.dto';
import { UpdateProjectMemberDto } from './dto/update-project-member.dto';
import { Project } from './entities/project.entity';
import { ProjectMember, ProjectRole } from './entities/project-member.entity';
import { ProjectStatus } from './enums/project-enums';

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name);

  constructor(
    @InjectRepository(Project)
    private readonly projects: Repository<Project>,
    @InjectRepository(ProjectMember)
    private readonly members: Repository<ProjectMember>,
  ) {}

  async create(dto: CreateProjectDto, userId: string): Promise<Project> {
    try {
      // Check if project name already exists for this user
      const existingProject = await this.projects.findOne({
        where: { name: dto.name, ownerId: userId },
      });

      if (existingProject) {
        throw new ConflictException('Project with this name already exists');
      }

      const project = this.projects.create({
        ...dto,
        ownerId: userId,
        status: ProjectStatus.ACTIVE,
      });

      const saved = await this.projects.save(project);

      // Add creator as owner
      await this.members.save({
        projectId: saved.id,
        userId,
        role: ProjectRole.OWNER,
      });

      this.logger.log(`Project "${saved.name}" created by ${userId}`);
      return this.projects.findOneOrFail({
        where: { id: saved.id },
        relations: ['owner', 'members', 'members.user', 'tasks'],
      });
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      this.logger.error(`Create project error: ${error.message}`);
      throw new InternalServerErrorException('Failed to create project');
    }
  }

  async findAll(): Promise<Project[]> {
    return this.projects.find({
      where: { status: ProjectStatus.ACTIVE },
      relations: ['owner', 'members', 'members.user', 'tasks'],
    });
  }

  async findAllWithArchived(): Promise<Project[]> {
    return this.projects.find({
      relations: ['owner', 'members', 'members.user', 'tasks'],
    });
  }

  async findOne(id: string): Promise<Project> {
    if (!id?.trim()) throw new BadRequestException('Project ID is required');

    const project = await this.projects.findOne({
      where: { id },
      relations: ['owner', 'members', 'members.user', 'tasks'],
    });

    if (!project) throw new NotFoundException('Project not found');
    if (project.status === ProjectStatus.DELETED) {
      throw new NotFoundException('Project has been deleted');
    }
    return project;
  }

  async update(id: string, dto: UpdateProjectDto, userId: string): Promise<Project> {
    try {
      const project = await this.findOne(id);
      await this.checkAccess(id, userId, [ProjectRole.OWNER, ProjectRole.LEAD]);

      // Prevent updating deleted projects
      if (project.status === ProjectStatus.DELETED) {
        throw new BadRequestException('Cannot update a deleted project');
      }

      // Check for name conflicts if name is being updated
      if (dto.name && dto.name !== project.name) {
        const existingProject = await this.projects.findOne({
          where: { name: dto.name, ownerId: project.ownerId },
        });

        if (existingProject) {
          throw new ConflictException('Project with this name already exists');
        }
      }

      Object.assign(project, dto);
      await this.projects.save(project);

      this.logger.log(`Project ${id} updated by ${userId}`);
      return this.findOne(id);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof ConflictException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      this.logger.error(`Update project error: ${error.message}`);
      throw new InternalServerErrorException('Failed to update project');
    }
  }

  async delete(id: string, userId: string): Promise<{ message: string }> {
    try {
      const project = await this.findOne(id);
      await this.checkAccess(id, userId, [ProjectRole.OWNER]);

      // Soft delete by updating status
      project.status = ProjectStatus.DELETED;
      await this.projects.save(project);

      this.logger.log(`Project ${id} marked as deleted by ${userId}`);
      return { message: 'Project deleted' };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      this.logger.error(`Delete project error: ${error.message}`);
      throw new InternalServerErrorException('Failed to delete project');
    }
  }

  async addMember(id: string, dto: AddProjectMemberDto, userId: string): Promise<ProjectMember> {
    try {
      await this.findOne(id);
      await this.checkAccess(id, userId, [ProjectRole.OWNER, ProjectRole.LEAD]);

      // Check if user already exists in project
      const existing = await this.members.findOne({
        where: { projectId: id, userId: dto.userId },
      });

      if (existing) throw new ConflictException('User already in project');

      // Check if user exists
      const userExists = await this.members.manager.findOne('User', {
        where: { id: dto.userId },
      });

      if (!userExists) {
        throw new NotFoundException('User not found');
      }

      const member = this.members.create({
        projectId: id,
        userId: dto.userId,
        role: dto.role || ProjectRole.MEMBER,
      });

      const saved = await this.members.save(member);

      this.logger.log(`User ${dto.userId} added to project ${id}`);

      return this.members.findOneOrFail({
        where: { id: saved.id },
        relations: ['user', 'project'],
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      this.logger.error(`Add member error: ${error.message}`);
      throw new InternalServerErrorException('Failed to add member');
    }
  }

  async removeMember(id: string, memberId: string, userId: string): Promise<{ message: string }> {
    try {
      await this.findOne(id);
      await this.checkAccess(id, userId, [ProjectRole.OWNER, ProjectRole.LEAD]);

      const member = await this.members.findOne({
        where: { id: memberId, projectId: id },
        relations: ['user'],
      });

      if (!member) throw new NotFoundException('Member not found');

      const ownerCount = await this.members.count({
        where: { projectId: id, role: ProjectRole.OWNER },
      });

      if (member.role === ProjectRole.OWNER && ownerCount === 1) {
        throw new BadRequestException('Cannot remove the only owner');
      }

      await this.members.remove(member);

      this.logger.log(`Member ${member.user?.username || memberId} removed from project ${id}`);
      return { message: 'Member removed' };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      this.logger.error(`Remove member error: ${error.message}`);
      throw new InternalServerErrorException('Failed to remove member');
    }
  }

  async updateMemberRole(id: string, memberId: string, dto: UpdateProjectMemberDto, userId: string): Promise<ProjectMember> {
    try {
      await this.findOne(id);
      await this.checkAccess(id, userId, [ProjectRole.OWNER]);

      const member = await this.members.findOne({
        where: { id: memberId, projectId: id },
        relations: ['user'],
      });

      if (!member) throw new NotFoundException('Member not found');

      // Prevent demoting the only owner
      if (member.role === ProjectRole.OWNER) {
        const ownerCount = await this.members.count({
          where: { projectId: id, role: ProjectRole.OWNER },
        });

        if (ownerCount === 1) {
          throw new BadRequestException('Cannot change role of the only owner');
        }
      }

      member.role = dto.role;
      await this.members.save(member);

      this.logger.log(`Member ${member.user?.username || memberId} role updated to ${dto.role}`);

      return this.members.findOneOrFail({
        where: { id: member.id },
        relations: ['user', 'project'],
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      this.logger.error(`Update member role error: ${error.message}`);
      throw new InternalServerErrorException('Failed to update member role');
    }
  }

  async getMembers(id: string): Promise<ProjectMember[]> {
    await this.findOne(id);
    return this.members.find({
      where: { projectId: id },
      relations: ['user'],
    });
  }

  async getUserProjects(userId: string): Promise<Project[]> {
    const userMembers = await this.members.find({
      where: { userId },
      relations: ['project', 'project.owner', 'project.members', 'project.tasks'],
    });

    return userMembers
      .map((m) => m.project)
      .filter((project) => project.status !== ProjectStatus.DELETED);
  }

  async getProjectMembersWithDetails(id: string): Promise<ProjectMember[]> {
    await this.findOne(id);
    return this.members.find({
      where: { projectId: id },
      relations: ['user', 'user.auth'],
    });
  }

  private async checkAccess(projectId: string, userId: string, allowedRoles: ProjectRole[]): Promise<void> {
    const member = await this.members.findOne({
      where: { projectId, userId },
    });

    if (!member || !allowedRoles.includes(member.role)) {
      throw new ForbiddenException('Access denied');
    }
  }
}
