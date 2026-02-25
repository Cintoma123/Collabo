import { IsEmail, IsString, MinLength, Validate } from 'class-validator';
import { IsEmailUniqueConstraint } from '../validators/is-email-unique.validator';
import { IsUsernameUniqueConstraint } from '../validators/is-username-unique.validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Invalid email format' })
  @Validate(IsEmailUniqueConstraint, { message: 'Email is already in use' })
  email: string;

  @IsString()
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  @Validate(IsUsernameUniqueConstraint, { message: 'Username is already in use' })
  name: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;
}

export class LoginDto {
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;
  @IsString()
  password: string;
}

export class ForgotPasswordDto {
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;
}

export class ResetPasswordDto {
  @IsString()
  token: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;
}

