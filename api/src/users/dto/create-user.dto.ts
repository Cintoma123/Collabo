import { IsEmail, IsNotEmpty, IsOptional, IsString, IsInt, Min, Max, IsUrl, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString({ message: 'Username must be a string' })
  @IsNotEmpty({ message: 'Username is required' })
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  name: string; // username

  // @IsString({ message: 'Password must be a string' })
  // @IsNotEmpty({ message: 'Password is required' })
  // @MinLength(6, { message: 'Password must be at least 6 characters long' })
  // password: string;

  @IsString({ message: 'Full name must be a string' })
  @IsOptional()
  @MinLength(2, { message: 'Full name must be at least 2 characters long' })
  fullName?: string;

  @IsString({ message: 'Bio must be a string' })
  @IsOptional()
  @MinLength(10, { message: 'Bio must be at least 10 characters long' })
  bio?: string;

  @IsInt({ message: 'Age must be an integer' })
  @IsOptional()
  @Min(13, { message: 'Age must be at least 13' })
  @Max(150, { message: 'Age cannot exceed 150' })
  age?: number;

  @IsString({ message: 'GitHub URL must be a string' })
  @IsOptional()
  @IsUrl({}, { message: 'GitHub URL must be a valid URL' })
  githubUrl?: string;
}
