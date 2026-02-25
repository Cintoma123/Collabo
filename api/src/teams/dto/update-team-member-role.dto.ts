import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { TeamRole } from '../enums/team-role.enum';

export class UpdateTeamMemberRoleDto {
  @IsEnum(TeamRole, { message: 'Role must be either admin or member' })
  @IsNotEmpty({ message: 'Role is required' })
  role: TeamRole;
}
