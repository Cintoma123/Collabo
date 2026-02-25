import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Req,
  Query,
} from '@nestjs/common';
import type { Request } from 'express';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AddProjectMemberDto } from './dto/add-project-member.dto';
import { UpdateProjectMemberDto } from './dto/update-project-member.dto';
import { ProjectRole } from './entities/project-member.entity';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  private getUserId(req: Request): string {
    return req['user']?.id || req['user']?.sub;
  }

  // 1. Project CRUD operations
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateProjectDto, @Req() req: Request) {
    return this.projectsService.create(dto, this.getUserId(req));
  }

  @Get()
  findAll(@Query('archived') archived?: string) {
    if (archived === 'true') {
      // Return all projects including archived for admin purposes
      return this.projectsService.findAllWithArchived();
    }
    return this.projectsService.findAll();
  }

  @Get('user/projects')
  getUserProjects(@Req() req: Request) {
    return this.projectsService.getUserProjects(this.getUserId(req));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProjectDto, @Req() req: Request) {
    return this.projectsService.update(id, dto, this.getUserId(req));
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Req() req: Request) {
    return this.projectsService.delete(id, this.getUserId(req));
  }

  // 2. Member management (consolidated)
  @Get(':id/members')
  getMembers(@Param('id') id: string) {
    return this.projectsService.getProjectMembersWithDetails(id);
  }

  @Post(':id/members')
  @HttpCode(HttpStatus.CREATED)
  manageMember(
    @Param('id') id: string,
    @Body() dto: AddProjectMemberDto & { memberId?: string; action?: 'add' | 'remove' | 'update' },
    @Req() req: Request,
  ) {
    const userId = this.getUserId(req);
    
    if (dto.action === 'remove' && dto.memberId) {
      return this.projectsService.removeMember(id, dto.memberId, userId);
    } else if (dto.action === 'update' && dto.memberId) {
      return this.projectsService.updateMemberRole(
        id, 
        dto.memberId, 
        { role: dto.role || ProjectRole.MEMBER }, 
        userId
      );
    } else {
      return this.projectsService.addMember(id, dto, userId);
    }
  }

  // 3. Legacy endpoints for backward compatibility
  @Delete(':id/members/:memberId')
  removeMember(
    @Param('id') id: string,
    @Param('memberId') memberId: string,
    @Req() req: Request,
  ) {
    return this.projectsService.removeMember(id, memberId, this.getUserId(req));
  }

  @Patch(':id/members/:memberId/role')
  updateMemberRole(
    @Param('id') id: string,
    @Param('memberId') memberId: string,
    @Body() dto: UpdateProjectMemberDto,
    @Req() req: Request,
  ) {
    return this.projectsService.updateMemberRole(id, memberId, dto, this.getUserId(req));
  }
}
