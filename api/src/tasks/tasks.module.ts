import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './tasks.service';
import { TasksController, TaskListController } from './tasks.controller';
import { TasksGateway } from './tasks.gateway';
import { TaskDeadlineService } from './task-deadline.service';
import { Task } from './entities/task.entity';
import { Project } from '../projects/entities/project.entity';
import { ProjectMember } from '../projects/entities/project-member.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, Project, ProjectMember]),
    ScheduleModule.forRoot(),
  ],
  controllers: [TasksController, TaskListController],
  providers: [TasksService, TasksGateway, TaskDeadlineService],
  exports: [TasksService, TasksGateway],
})
export class TasksModule {}
