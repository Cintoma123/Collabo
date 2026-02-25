import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Auth } from './entities/auth.entity';
import { User } from '../users/entities/user.entity';
import {
  RegisterDto,
  LoginDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from './dto/auth.dto';
// EmailService removed — email notifications are disabled in this build

@Injectable()
export class AuthsService {
  private readonly logger = new Logger(AuthsService.name);

  constructor(
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    // emailService removed
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    try {
      const hashedPassword = await bcrypt.hash(registerDto.password, 10);

      // Check if auth already exists
      const existingAuth = await this.authRepository.findOne({
        where: { email: registerDto.email },
      });

      if (existingAuth) {
        throw new BadRequestException('User with this email already exists');
      }

      // Create new auth
      const auth = this.authRepository.create({
        email: registerDto.email,
        name: registerDto.name,
        password: hashedPassword,
        provider: 'local',
      });
      await this.authRepository.save(auth);

      // Create corresponding user profile
      const user = this.userRepository.create({
        auth: auth,
      });
      await this.userRepository.save(user);

      // EmailService removed: welcome email skipped in this environment

      this.logger.log(`User registered: ${auth.email}`);

      return {
        message: 'Registration successful. You can now login.',
        userId: auth.id,
      };
    } catch (error) {
      this.logger.error(`Registration failed: ${error.message}`);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Registration failed');
    }
  }



  async login(loginDto: LoginDto) {
    const auth = await this.authRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!auth) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Check if auth has a password (OAuth users might not have one)
    if (!auth.password) {
      throw new UnauthorizedException('This account uses OAuth login. Please use Google to sign in.');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      auth.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Update last login
    auth.lastLoginAt = new Date();
    await this.authRepository.save(auth);

    // Get user profile
    const user = await this.userRepository.findOne({
      where: { auth: { id: auth.id } },
    });

    // Generate tokens
    const accessToken = this.jwtService.sign(
      {
        sub: auth.id,
        email: auth.email,
        type: 'access',
      },
      {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('JWT_EXPIRES_IN', '15m'),
      },
    );

    const refreshToken = this.jwtService.sign(
      {
        sub: auth.id,
        type: 'refresh',
      },
      {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN', '7d'),
      },
    );

    this.logger.log(`User logged in: ${auth.email}`);

    return {
      accessToken,
      refreshToken,
      user: {
        id: auth.id,
        email: auth.email,
        name: auth.name,
        avatarUrl: user?.avatarUrl,
        isProfileComplete: user?.isProfileComplete,
      },
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const auth = await this.authRepository.findOne({
      where: { email: forgotPasswordDto.email },
    });

    // Always return success message for security reasons (not to reveal if email exists)
    if (!auth) {
      return {
        message: 'If an account exists with that email, you will receive a password reset link',
      };
    }

    // Generate reset token
    const resetToken = this.jwtService.sign(
      { sub: auth.id, type: 'password-reset' },
      {
        secret: this.configService.get('JWT_RESET_SECRET'),
        expiresIn: '1h',
      },
    );

    // EmailService removed: password reset email should be sent by external worker

    this.logger.log(`Password reset requested for: ${auth.email}`);

    return {
      message: 'If an account exists with that email, you will receive a password reset link',
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    try {
      const decoded = this.jwtService.verify(resetPasswordDto.token, {
        secret: this.configService.get('JWT_RESET_SECRET'),
      });

      // Verify token type
      if (decoded.type !== 'password-reset') {
        throw new BadRequestException('Invalid token type');
      }

      const auth = await this.authRepository.findOne({
        where: { id: decoded.sub },
      });

      if (!auth) {
        throw new BadRequestException('User not found');
      }

      const hashedPassword = await bcrypt.hash(resetPasswordDto.password, 10);
      auth.password = hashedPassword;
      await this.authRepository.save(auth);

      this.logger.log(`Password reset for: ${auth.email}`);

      return { message: 'Password reset successfully. Please login with your new password.' };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Invalid or expired reset token');
    }
  }

  async logout() {
    // In JWT-based authentication, logout is typically handled on the client side
    // by removing the token. This endpoint can be used for additional cleanup if needed.
    this.logger.log('User logged out');
    return { message: 'Logged out successfully' };
  }

  async getCurrentUser(authId: string) {
    const auth = await this.authRepository.findOne({
      where: { id: authId },
    });

    if (!auth) {
      throw new UnauthorizedException('User not found');
    }

    // Get user profile
    const user = await this.userRepository.findOne({
      where: { auth: { id: auth.id } },
    });

    return {
      id: auth.id,
      email: auth.email,
      name: auth.name,
      avatarUrl: user?.avatarUrl,
      isProfileComplete: user?.isProfileComplete,
    };
  }

  async refreshToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      const auth = await this.authRepository.findOne({
        where: { id: decoded.sub },
      });

      if (!auth || !auth.isActive) {
        throw new UnauthorizedException('User not found or inactive');
      }

      const accessToken = this.jwtService.sign(
        {
          sub: auth.id,
          email: auth.email,
          type: 'access',
        },
        {
          secret: this.configService.get('JWT_SECRET'),
          expiresIn: this.configService.get('JWT_EXPIRES_IN', '15m'),
        },
      );

      return { accessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async validateGoogleUser(googleUser: any) {
    try {
      if (!googleUser.googleId) {
        throw new BadRequestException('Invalid Google ID');
      }

      // Check if auth exists by googleId
      let auth = await this.authRepository.findOne({
        where: { googleId: googleUser.googleId },
      });

      if (auth) {
        // User already linked to this Google account - just update last login
        auth.lastLoginAt = new Date();
        await this.authRepository.save(auth);
        this.logger.log(`Google user logged in: ${auth.email}`);
      } else {
        // New Google login - check if email exists
        auth = await this.authRepository.findOne({
          where: { email: googleUser.email },
        });

        if (auth) {
          // Email exists - link Google to existing account
          if (!auth.googleId) {
            auth.googleId = googleUser.googleId;
            auth.provider = 'google';
            auth.lastLoginAt = new Date();
            
            try {
              await this.authRepository.save(auth);
              this.logger.log(`Google account linked to existing user: ${auth.email}`);
            } catch (updateError: any) {
              this.logger.error(`Error linking Google to existing user: ${updateError.message}`);
              // If unique constraint on googleId fails, someone else might have linked this googleId
              if (updateError.code === '23505') {
                // Retry - fetch again to get the account that linked it
                auth = await this.authRepository.findOne({
                  where: { googleId: googleUser.googleId },
                });
                if (!auth) {
                  throw updateError;
                }
                auth.lastLoginAt = new Date();
                await this.authRepository.save(auth);
              } else {
                throw updateError;
              }
            }
          } else {
            // Email already has a Google account linked
            auth.lastLoginAt = new Date();
            await this.authRepository.save(auth);
          }
        } else {
          // Create completely new auth account
          // Generate unique name from email
          const nameBase = googleUser.name || googleUser.email.split('@')[0];
          let uniqueName = nameBase;
          let counter = 1;
          
          // Check if name is already taken, if so add counter
          let existingName = await this.authRepository.findOne({
            where: { name: uniqueName },
          });
          
          while (existingName) {
            uniqueName = `${nameBase}${counter}`;
            existingName = await this.authRepository.findOne({
              where: { name: uniqueName },
            });
            counter++;
          }

          auth = this.authRepository.create({
            email: googleUser.email,
            name: uniqueName,
            googleId: googleUser.googleId,
            provider: 'google',
            isActive: true,
          });
          
          try {
            auth = await this.authRepository.save(auth);
            this.logger.log(`Created new Google auth: ${auth.email} with name: ${auth.name}`);
            
            // Create corresponding user profile with Google data
            const user = this.userRepository.create({
              avatarUrl: googleUser.avatarUrl,
              fullName: googleUser.name,
              username: auth.name,
              auth: auth,
            });
            await this.userRepository.save(user);
            this.logger.log(`User registered via Google: ${auth.email}`);
          } catch (createError: any) {
            this.logger.error(`Error creating Google auth: ${createError.message}`, createError);
            // Handle constraint violations during creation
            if (createError.code === '23505') {
              // Duplicate email or googleId - fetch existing and use it
              auth = await this.authRepository.findOne({
                where: { googleId: googleUser.googleId },
              });
              if (!auth) {
                auth = await this.authRepository.findOne({
                  where: { email: googleUser.email },
                });
              }
              if (!auth) {
                throw createError;
              }
              auth.lastLoginAt = new Date();
              await this.authRepository.save(auth);
            } else {
              throw createError;
            }
          }
        }
      }

      // Get user profile
      let userProfile = await this.userRepository.findOne({
        where: { auth: { id: auth.id } },
      });

      // If profile doesn't exist, create it
      if (!userProfile) {
        const username = auth.name || googleUser.name.split(' ')[0].toLowerCase();
        userProfile = this.userRepository.create({
          avatarUrl: googleUser.avatarUrl,
          fullName: googleUser.name,
          username: username,
          auth: auth,
        });
        userProfile = await this.userRepository.save(userProfile);
        this.logger.log(`Created user profile for: ${auth.email}`);
      } else if (!userProfile.fullName && googleUser.name) {
        // Update profile with Google data if missing
        userProfile.fullName = googleUser.name;
        if (!userProfile.avatarUrl && googleUser.avatarUrl) {
          userProfile.avatarUrl = googleUser.avatarUrl;
        }
        userProfile = await this.userRepository.save(userProfile);
      }

      // Generate JWT
      const accessToken = this.jwtService.sign(
        {
          sub: auth.id,
          email: auth.email,
          type: 'access',
        },
        {
          secret: this.configService.get('JWT_SECRET'),
          expiresIn: this.configService.get('JWT_EXPIRES_IN', '15m'),
        },
      );

      const refreshToken = this.jwtService.sign(
        {
          sub: auth.id,
          type: 'refresh',
        },
        {
          secret: this.configService.get('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN', '7d'),
        },
      );

      this.logger.log(`Google auth successful for: ${auth.email}`);

      return {
        accessToken,
        refreshToken,
        user: {
          id: auth.id,
          email: auth.email,
          name: auth.name,
          fullName: userProfile?.fullName || googleUser.name,
          avatarUrl: userProfile?.avatarUrl || googleUser.avatarUrl,
          isProfileComplete: userProfile?.isProfileComplete || false,
        },
      };
    } catch (error: any) {
      this.logger.error(`Google auth failed: ${error.message}`, error.stack);
      throw new BadRequestException(`Google authentication failed: ${error.message}`);
    }
  }


}
