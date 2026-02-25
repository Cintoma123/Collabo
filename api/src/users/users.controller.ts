import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auths/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getCurrentUser(@Request() req: any) {
    return this.usersService.findByAuthId(req.user.sub);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Request() req: any) {
    // GET /users returns only the currently authenticated user
    return this.usersService.findByAuthId(req.user.sub);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string, @Request() req: any) {
    // Users can only access their own data unless they're admin
    if (id !== req.user.sub) {
      return this.usersService.findOne(req.user.sub);
    }
    return this.usersService.findOne(id);
  }

  @Get(':id/profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Param('id') id: string, @Request() req: any) {
    // Users can only access their own profile
    return this.usersService.getProfile(req.user.sub);
  }

  @Post(':id/profile')
  @UseGuards(JwtAuthGuard)
  updateProfile(@Param('id') id: string, @Body() dto: UpdateUserDto, @Request() req: any) {
    // Users can only update their own profile
    return this.usersService.updateProfile(req.user.sub, dto);
  }

  @Get(':id/profile/validate')
  @UseGuards(JwtAuthGuard)
  validateProfile(@Param('id') id: string, @Request() req: any) {
    // Users can only validate their own profile
    return this.usersService.validateCompleteness(req.user.sub);
  }

  @Delete(':id/profile')
  @UseGuards(JwtAuthGuard)
  deleteProfile(@Param('id') id: string, @Request() req: any) {
    // Users can only delete their own profile
    return this.usersService.deleteProfile(req.user.sub);
  }
}
