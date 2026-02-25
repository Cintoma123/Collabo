import { IsString, IsOptional, MinLength } from 'class-validator';

export class UpdateTeamDto {
  @IsString({ message: 'Team name must be a string' })
  @IsOptional()
  @MinLength(3, { message: 'Team name must be at least 3 characters long' })
  name?: string;

  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  @MinLength(10, { message: 'Description must be at least 10 characters long' })
  description?: string;
}
