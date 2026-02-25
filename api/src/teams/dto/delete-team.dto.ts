import { IsString, IsNotEmpty } from 'class-validator';

export class DeleteTeamDto {
  @IsString({ message: 'Team ID must be a string' })
  @IsNotEmpty({ message: 'Team ID is required' })
  teamId: string;
}