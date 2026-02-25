import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auths/guards/jwt-auth.guard';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { AddTeamMemberDto } from './dto/add-team-member.dto';
import { DeleteTeamDto } from './dto/delete-team.dto';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  private getUserId(req: Request): string {
    return req['user']?.id || req['user']?.sub;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateTeamDto, @Req() req: Request) {
    return this.teamsService.create(dto, this.getUserId(req));
  }

  @Get('user/teams')
  getUserTeams(@Req() req: Request) {
    return this.teamsService.getUserTeams(this.getUserId(req));
  }

  @Get(':id/members')
  getMembers(@Param('id') id: string) {
    return this.teamsService.getMembers(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  delete(@Param('id') id: string, @Req() req: Request) {
    return this.teamsService.delete(id, this.getUserId(req));
  }

  @Post(':id/members')
  @HttpCode(HttpStatus.CREATED)
  addMember(@Param('id') id: string, @Body() dto: AddTeamMemberDto, @Req() req: Request) {
    return this.teamsService.addMember(id, dto, this.getUserId(req));
  }

  @Delete(':id/members/:memberId')
  removeMember(
    @Param('id') id: string,
    @Param('memberId') memberId: string,
    @Req() req: Request,
  ) {
    return this.teamsService.removeMember(id, memberId, this.getUserId(req));
  }
}
