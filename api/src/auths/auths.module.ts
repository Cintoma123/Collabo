import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthsService } from './auths.service';
import { AuthsController } from './auths.controller';
import { Auth } from './entities/auth.entity';
import { User } from '../users/entities/user.entity';
import { IsEmailUniqueConstraint } from './validators/is-email-unique.validator';
import { IsUsernameUniqueConstraint } from './validators/is-username-unique.validator';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
// import { ProfileCompleteGuard } from './guards/profile-complete.guard';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    ThrottlerModule,
    TypeOrmModule.forFeature([Auth, User]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN') },
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
    UsersModule,
  ],
  controllers: [AuthsController],
  providers: [
    AuthsService,
    // EmailService removed
    IsEmailUniqueConstraint,
    IsUsernameUniqueConstraint,
    JwtStrategy,
    GoogleStrategy,
    // ProfileCompleteGuard,
  ],
  exports: [/* ProfileCompleteGuard, */ TypeOrmModule],
})
export class AuthsModule {}
