import { IsEnum } from 'class-validator';
import { ProjectRole } from '../entities/project-member.entity';

export class UpdateProjectMemberDto {
  @IsEnum(ProjectRole, { message: 'Role must be one of: owner, lead, member, viewer' })
  role: ProjectRole;
}
