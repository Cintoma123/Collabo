import { IsString, IsNotEmpty, IsOptional, IsEnum, MinLength, IsDateString } from 'class-validator';
import { TaskStatus, TaskPriority } from '../../projects/enums/project-enums';

export class CreateTaskDto {
  @IsString({ message: 'Task title must be a string' })
  @IsNotEmpty({ message: 'Task title is required' })
  @MinLength(3, { message: 'Task title must be at least 3 characters' })
  title: string;

  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  description?: string;

  @IsString({ message: 'Assigned user ID must be a string' })
  @IsOptional()
  assignedToId?: string;

  @IsEnum(TaskPriority, { message: 'Priority must be one of: low, medium, high, urgent' })
  @IsOptional()
  priority?: TaskPriority;

  @IsDateString({}, { message: 'Due date must be a valid date' })
  @IsOptional()
  dueDate?: string;
}
