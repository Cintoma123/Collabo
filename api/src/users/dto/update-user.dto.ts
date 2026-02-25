import { IsOptional, IsString,IsInt, Min, Max, IsUrl, MinLength, IsEmail } from 'class-validator';

export class UpdateUserDto {
  @IsString({ message: 'Full name must be a string' })
  @IsOptional()
  @MinLength(2, { message: 'Full name must be at least 2 characters long' })
  fullName?: string;

  @IsString({ message: 'Username must be a string' })
  @IsOptional()
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  username?: string;

  @IsString({ message: 'Bio must be a string' })
  @IsOptional()
  @MinLength(1, { message: 'Bio must not be empty' })
  bio?: string;

  @IsInt({ message: 'Age must be an integer' })
  @IsOptional()
  @Min(13, { message: 'Age must be at least 13' })
  @Max(150, { message: 'Age cannot exceed 150' })
  age?: number;
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsOptional()
  email?: string;

  @IsString({ message: 'GitHub URL must be a string' })
  @IsOptional()
  @IsUrl({}, { message: 'GitHub URL must be a valid URL' })
  githubUrl?: string;

  @IsString({ message: 'LinkedIn URL must be a string' })
  @IsOptional()
  @IsUrl({}, { message: 'LinkedIn URL must be a valid URL' })
  linkedinUrl?: string;

  @IsString({ message: 'Portfolio URL must be a string' })
  @IsOptional()
  @IsUrl({}, { message: 'Portfolio URL must be a valid URL' })
  portfolioUrl?: string;

  @IsString({ message: 'Avatar URL must be a string' })
  @IsOptional()
  @IsUrl({}, { message: 'Avatar URL must be a valid URL' })
  avatarUrl?: string;

  @IsString({ message: 'Location must be a string' })
  @IsOptional()
  location?: string;

  @IsString({ message: 'Company must be a string' })
  @IsOptional()
  company?: string;

  @IsString({ message: 'Job title must be a string' })
  @IsOptional()
  jobTitle?: string;
}
