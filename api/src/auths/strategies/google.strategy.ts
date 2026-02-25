import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { AuthsService } from '../auths.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private readonly logger = new Logger(GoogleStrategy.name);

  constructor(
    private configService: ConfigService,
    private authService: AuthsService,
  ) {
    const clientID = configService.get('GOOGLE_CLIENT_ID');
    const clientSecret = configService.get('GOOGLE_CLIENT_SECRET');
    const callbackURL = configService.get('GOOGLE_CALLBACK_URL');
    
    super({
      clientID,
      clientSecret,
      callbackURL,
      scope: ['email', 'profile'],
    });

    this.logger.debug(`Google OAuth initialized with callback: ${callbackURL}`);
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      const { name, emails, photos, id } = profile;

      if (!emails || emails.length === 0) {
        return done(new Error('No email found in Google profile'), null);
      }

      const user = {
        email: emails[0].value,
        name: name.givenName + ' ' + name.familyName,
        avatarUrl: photos && photos.length > 0 ? photos[0].value : null,
        googleId: id,
        provider: 'google',
      };

      this.logger.log(`Validating Google user: ${user.email}`);
      const validatedUser = await this.authService.validateGoogleUser(user);
      done(null, validatedUser);
    } catch (error) {
      this.logger.error(`Google validation error: ${error.message}`, error.stack);
      done(error, null);
    }
  }
}
