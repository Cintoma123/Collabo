import { IsString, IsNotEmpty, IsOptional, IsUrl, MinLength, MaxLength, Matches } from 'class-validator';

export class CreateProjectDto {
  @IsString({ message: 'Project name must be a string' })
  @IsNotEmpty({ message: 'Project name is required' })
  @MinLength(3, { message: 'Project name must be at least 3 characters' })
  @MaxLength(100, { message: 'Project name cannot exceed 100 characters' })
  @Matches(/^[a-zA-Z0-9\s\-_]+$/, { message: 'Project name can only contain letters, numbers, spaces, hyphens, and underscores' })
  name: string;

  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  @MinLength(10, { message: 'Description must be at least 10 characters' })
  @MaxLength(1000, { message: 'Description cannot exceed 1000 characters' })
  description?: string;

  @IsString({ message: 'Repository URL must be a string' })
  @IsOptional()
  @IsUrl({}, { message: 'Repository URL must be a valid URL' })
  repositoryUrl?: string;
}
