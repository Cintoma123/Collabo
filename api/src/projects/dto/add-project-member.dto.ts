import { IsString, IsOptional, IsEnum, IsUUID } from 'class-validator';
import { ProjectRole } from '../entities/project-member.entity';

export class AddProjectMemberDto {
  @IsString({ message: 'User ID must be a string' })
  @IsUUID('4', { message: 'User ID must be a valid UUID' })
  userId: string;

  @IsEnum(ProjectRole, { message: 'Role must be one of: owner, lead, member, viewer' })
  @IsOptional()
  role?: ProjectRole;
}
