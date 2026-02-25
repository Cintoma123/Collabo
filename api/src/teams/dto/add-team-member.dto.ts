import { IsString, IsNotEmpty, IsOptional, IsEnum, MinLength } from 'class-validator';
import { TeamRole } from '../enums/team-role.enum';

export class AddTeamMemberDto {
  @IsString({ message: 'User ID must be a string' })
  @IsNotEmpty({ message: 'User ID is required' })
  userId: string;

  @IsEnum(TeamRole, { message: 'Role must be either admin or member' })
  @IsOptional()
  role?: TeamRole;
}
