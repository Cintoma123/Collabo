import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    try {
      const existing = await this.users.findOne({
        where: [{ email: dto.email }, { username: dto.name }],
      });

      if (existing) {
        const field = existing.email === dto.email ? 'Email' : 'Username';
        throw new ConflictException(`${field} already exists`);
      }

      this.validateProfile(dto);

      const user = this.users.create(dto);
      user.isProfileComplete = this.isComplete(user);

      const saved = await this.users.save(user);
      this.logger.log(`User created: ${saved.id}`);

      return saved;
    } catch (error) {
      if (error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Create user error: ${error.message}`);
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async findAll(): Promise<User[]> {
    return this.users.find();
  }

  async findOne(id: string): Promise<User> {
    if (!id?.trim()) throw new BadRequestException('User ID is required');

    const user = await this.users.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    if (!email?.includes('@')) {
      throw new BadRequestException('Valid email is required');
    }

    const user = await this.users.findOne({ where: { email } });
    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async findByAuthId(authId: string) {
    const user = await this.users.findOne({
      where: { auth: { id: authId } },
      relations: ['auth'],
    });

    if (!user) {
      throw new NotFoundException('User profile not found');
    }

    return {
      id: user.id,
      fullName: user.fullName,
      username: user.username,
      bio: user.bio,
      age: user.age,
      email: user.email,
      githubUrl: user.githubUrl,
      linkedinUrl: user.linkedinUrl,
      portfolioUrl: user.portfolioUrl,
      avatarUrl: user.avatarUrl,
      location: user.location,
      company: user.company,
      jobTitle: user.jobTitle,
      isProfileComplete: user.isProfileComplete,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    try {
      if (!id?.trim()) throw new BadRequestException('User ID is required');

      this.validateProfile(dto);

      const user = await this.users.preload({ id, ...dto });
      if (!user) throw new NotFoundException('User not found');

      user.isProfileComplete = this.isComplete(user);
      const updated = await this.users.save(user);

      this.logger.log(`User updated: ${id}`);
      return updated;
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      this.logger.error(`Update user error: ${error.message}`);
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  async updateProfile(authId: string, dto: UpdateUserDto): Promise<User> {
    try {
      const userData = await this.findByAuthId(authId);
      const user = await this.findOne(userData.id);

      this.validateProfile(dto);

      Object.assign(user, {
        fullName: dto.fullName ?? user.fullName,
        username: dto.username ?? user.username,
        bio: dto.bio ?? user.bio,
        age: dto.age ?? user.age,
        email: dto.email ?? user.email,
        githubUrl: dto.githubUrl ?? user.githubUrl,
        linkedinUrl: dto.linkedinUrl ?? user.linkedinUrl,
        portfolioUrl: dto.portfolioUrl ?? user.portfolioUrl,
        avatarUrl: dto.avatarUrl ?? user.avatarUrl,
        location: dto.location ?? user.location,
        company: dto.company ?? user.company,
        jobTitle: dto.jobTitle ?? user.jobTitle,
      });

      user.isProfileComplete = this.isComplete(user);
      const updated = await this.users.save(user);

      this.logger.log(`Profile updated: ${user.id}`);
      return updated;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Update profile error: ${error.message}`);
      throw new InternalServerErrorException('Failed to update profile');
    }
  }

  async getProfile(authId: string) {
    const user = await this.findByAuthId(authId);

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      fullName: user.fullName,
      bio: user.bio,
      age: user.age,
      githubUrl: user.githubUrl,
      isProfileComplete: user.isProfileComplete,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async validateCompleteness(authId: string) {
    const userData = await this.findByAuthId(authId);
    const user = await this.findOne(userData.id);
    const missing: string[] = [];

    if (!user.fullName) missing.push('fullName');
    if (!user.bio) missing.push('bio');
    if (!user.age) missing.push('age');
    if (!user.githubUrl) missing.push('githubUrl');

    return {
      isComplete: missing.length === 0,
      missingFields: missing,
    };
  }

  async delete(id: string): Promise<{ message: string }> {
    try {
      const user = await this.findOne(id);
      await this.users.remove(user);

      this.logger.log(`User deleted: ${id}`);
      return { message: 'User deleted' };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Delete user error: ${error.message}`);
      throw new InternalServerErrorException('Failed to delete user');
    }
  }

  async deleteProfile(authId: string): Promise<{ message: string }> {
    try {
      const userData = await this.findByAuthId(authId);
      const user = await this.findOne(userData.id);

      await this.users.remove(user);

      this.logger.log(`Profile deleted for auth ID: ${authId}`);
      return { message: 'Profile deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Delete profile error: ${error.message}`);
      throw new InternalServerErrorException('Failed to delete profile');
    }
  }

  private validateProfile(dto: CreateUserDto | UpdateUserDto): void {
    if (dto.bio && dto.bio.length < 10) {
      throw new BadRequestException('Bio must be at least 10 characters');
    }

    if (dto.age && (dto.age < 13 || dto.age > 150)) {
      throw new BadRequestException('Age must be between 13 and 150');
    }
  }

  private isComplete(user: User): boolean {
    return !!(user.fullName && user.bio && user.age && user.githubUrl && user.email);
  }
}
