import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTeamDto } from './dto/create-team.dto';
import { AddTeamMemberDto } from './dto/add-team-member.dto';
import { Team } from './entities/team.entity';
import { TeamMember } from './entities/team-member.entity';
import { TeamRole } from './enums/team-role.enum';

@Injectable()
export class TeamsService {
  private readonly logger = new Logger(TeamsService.name);

  constructor(
    @InjectRepository(Team)
    private readonly teams: Repository<Team>,
    @InjectRepository(TeamMember)
    private readonly members: Repository<TeamMember>,
  ) {}

  async create(dto: CreateTeamDto, userId: string): Promise<Team> {
    try {
      const existing = await this.teams.findOne({ where: { name: dto.name } });
      if (existing) throw new ConflictException(`Team "${dto.name}" already exists`);

      const team = this.teams.create({ ...dto, ownerId: userId });
      const saved = await this.teams.save(team);

      await this.members.save({ teamId: saved.id, userId, role: TeamRole.ADMIN });

      this.logger.log(`Team "${saved.name}" created by ${userId}`);
      return this.teams.findOneOrFail({
        where: { id: saved.id },
        relations: ['members', 'members.user', 'owner'],
      });
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      this.logger.error(`Error creating team: ${error.message}`);
      throw new InternalServerErrorException('Failed to create team');
    }
  }

  async getUserTeams(userId: string): Promise<Team[]> {
    const userMembers = await this.members.find({
      where: { userId },
      relations: ['team', 'team.members', 'team.owner'],
    });

    return userMembers.map((m) => m.team);
  }

  async getMembers(id: string): Promise<TeamMember[]> {
    await this.findOne(id);
    return this.members.find({ where: { teamId: id }, relations: ['user'] });
  }

  async delete(id: string, userId: string): Promise<{ message: string }> {
    const team = await this.findOne(id);
    
    // Allow deletion if user is admin OR the team owner
    const member = await this.members.findOne({
      where: { teamId: id, userId },
    });
    
    if (!member || (member.role !== TeamRole.ADMIN && team.ownerId !== userId)) {
      throw new ForbiddenException(`Only admins or team owner can delete this team`);
    }

    await this.teams.remove(team);

    this.logger.log(`Team ${id} deleted by ${userId}`);
    return { message: `Team deleted` };
  }

  async addMember(id: string, dto: AddTeamMemberDto, userId: string): Promise<TeamMember> {
    await this.findOne(id);
    await this.checkAdmin(id, userId);

    const existing = await this.members.findOne({
      where: { teamId: id, userId: dto.userId },
    });

    if (existing) throw new ConflictException(`User already in team`);

    const member = this.members.create({
      teamId: id,
      userId: dto.userId,
      role: dto.role || TeamRole.MEMBER,
    });

    const saved = await this.members.save(member);

    this.logger.log(`User ${dto.userId} added to team ${id}`);

    return this.members.findOneOrFail({
      where: { id: saved.id },
      relations: ['user', 'team'],
    });
  }

  async removeMember(id: string, memberId: string, userId: string): Promise<{ message: string }> {
    await this.findOne(id);
    await this.checkAdmin(id, userId);

    const member = await this.members.findOne({
      where: { id: memberId, teamId: id },
    });

    if (!member) throw new NotFoundException(`Member not found`);

    const adminCount = await this.members.count({
      where: { teamId: id, role: TeamRole.ADMIN },
    });

    if (member.role === TeamRole.ADMIN && adminCount === 1) {
      throw new BadRequestException(`Cannot remove the only admin`);
    }

    await this.members.remove(member);

    this.logger.log(`User removed from team ${id}`);
    return { message: `Member removed` };
  }

  private async checkAdmin(teamId: string, userId: string): Promise<void> {
    const member = await this.members.findOne({
      where: { teamId, userId },
    });

    if (!member || member.role !== TeamRole.ADMIN) {
      throw new ForbiddenException(`Only admins can perform this action`);
    }
  }

  private async findOne(id: string): Promise<Team> {
    if (!id?.trim()) throw new BadRequestException('Team ID is required');

    const team = await this.teams.findOne({
      where: { id },
      relations: ['members', 'members.user', 'owner'],
    });

    if (!team) throw new NotFoundException(`Team not found`);
    return team;
  }
}
