import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auth } from '../entities/auth.entity';
import { User } from '../../users/entities/user.entity';

@ValidatorConstraint({ name: 'IsUsernameUnique', async: true })
@Injectable()
export class IsUsernameUniqueConstraint implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async validate(username: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { username } });
    return !user;
  }

  defaultMessage(args: ValidationArguments): string {
    return `Username ${args.value} is already in use`;
  }
}
