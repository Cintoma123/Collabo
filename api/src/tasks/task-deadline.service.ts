import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan } from 'typeorm';
import { Task, TaskStatus } from './entities/task.entity';
import { TasksGateway } from './tasks.gateway';

@Injectable()
export class TaskDeadlineService {
  private readonly logger = new Logger(TaskDeadlineService.name);

  constructor(
    @InjectRepository(Task)
    private readonly tasks: Repository<Task>,
    private readonly gateway: TasksGateway,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async checkUpcomingDeadlines() {
    try {
      const now = new Date();
      const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      const upcomingTasks = await this.tasks.find({
        where: {
          status: TaskStatus.PENDING,
          dueDate: MoreThan(now),
        },
        relations: ['assignedTo'],
      });

      for (const task of upcomingTasks) {
        if (task.assignedToId && task.dueDate && task.dueDate <= in24Hours) {
          const hoursRemaining = Math.ceil(
            (task.dueDate.getTime() - now.getTime()) / (60 * 60 * 1000),
          );
          this.gateway.emitTaskDeadlineWarning(task.assignedToId, task.id, hoursRemaining);
        }
      }

      this.logger.log(`Checked ${upcomingTasks.length} upcoming deadlines`);
    } catch (error) {
      this.logger.error(`Error checking deadlines: ${error.message}`);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async checkOverdueTasks() {
    try {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const overdueTasks = await this.tasks.find({
        where: {
          status: TaskStatus.PENDING,
          dueDate: LessThan(yesterday),
        },
        relations: ['assignedTo'],
      });

      for (const task of overdueTasks) {
        if (task.assignedToId && task.dueDate) {
          const daysOverdue = Math.floor(
            (Date.now() - task.dueDate.getTime()) / (24 * 60 * 60 * 1000),
          );
          this.logger.warn(`Task ${task.id} is ${daysOverdue} days overdue`);
          this.gateway.emitTaskDeadlineWarning(task.assignedToId, task.id, -daysOverdue);
        }
      }

      this.logger.log(`Checked ${overdueTasks.length} overdue tasks`);
    } catch (error) {
      this.logger.error(`Error checking overdue tasks: ${error.message}`);
    }
  }
}
