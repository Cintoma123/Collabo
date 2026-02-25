import { IsString, IsOptional, IsEnum, MinLength, IsDateString } from 'class-validator';
import { TaskStatus, TaskPriority } from '../../projects/enums/project-enums';

export class UpdateTaskDto {
  @IsString({ message: 'Task title must be a string' })
  @IsOptional()
  @MinLength(3, { message: 'Task title must be at least 3 characters' })
  title?: string;

  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  description?: string;

  @IsString({ message: 'Assigned user ID must be a string' })
  @IsOptional()
  assignedToId?: string;

  @IsEnum(TaskStatus, { message: 'Status must be one of: pending, in_progress, completed, blocked, cancelled' })
  @IsOptional()
  status?: TaskStatus;

  @IsEnum(TaskPriority, { message: 'Priority must be one of: low, medium, high, urgent' })
  @IsOptional()
  priority?: TaskPriority;

  @IsDateString({}, { message: 'Due date must be a valid date' })
  @IsOptional()
  dueDate?: string;
}
