import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('projects/:projectId/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  private getUserId(req: Request): string {
    return req['user']?.id || req['user']?.sub;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Param('projectId') projectId: string,
    @Body() dto: CreateTaskDto,
    @Req() req: Request,
  ) {
    return this.tasksService.create(projectId, dto, this.getUserId(req));
  }

  @Get()
  findAll(@Param('projectId') projectId: string) {
    return this.tasksService.findAll(projectId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
    @Req() req: Request,
  ) {
    return this.tasksService.update(id, dto, this.getUserId(req));
  }

  @Patch(':id/complete')
  markComplete(@Param('id') id: string, @Req() req: Request) {
    return this.tasksService.markComplete(id, this.getUserId(req));
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Req() req: Request) {
    return this.tasksService.delete(id, this.getUserId(req));
  }
}

// Alternative controller for task-specific routes
@Controller('tasks')
export class TaskListController {
  constructor(private readonly tasksService: TasksService) {}

  private getUserId(req: Request): string {
    return req['user']?.id || req['user']?.sub;
  }

  @Get('user/assigned')
  getUserTasks(@Req() req: Request) {
    return this.tasksService.getUserTasks(this.getUserId(req));
  }
}
