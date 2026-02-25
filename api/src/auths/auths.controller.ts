
import { Controller, Post, Body, Get, UseGuards, Req, Res, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { AuthsService } from './auths.service';
import {
  RegisterDto,
  LoginDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { BotDetectionGuard } from './guards/bot-detection.guard';

@Controller('auth')
export class AuthsController {
  private readonly logger = new Logger(AuthsController.name);
  constructor(
    private readonly authsService: AuthsService,
    private readonly configService: ConfigService,
  ) {}

  @Post('register')
  @UseGuards(BotDetectionGuard)
  @Throttle({ default: { limit: 3, ttl: 60000 } }) // 3 registrations per minute
  register(@Body() registerDto: RegisterDto) {
    return this.authsService.register(registerDto);
  }

  @Post('login')
  @UseGuards(BotDetectionGuard)
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 login attempts per minute
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res,
  ) {
    const result = await this.authsService.login(loginDto);

    // set httpOnly cookies so frontend can use cookie-presence as auth indicator
    try {
      const frontendUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:3001';
      const isProduction = (this.configService.get('NODE_ENV') || 'development') === 'production' || frontendUrl.startsWith('https');
      
      // Determine cookie domain - critical for cross-port/localhost scenarios
      // For localhost development, we need explicit domain to work across different ports
      const domain = isProduction 
        ? '.' + new URL(frontendUrl).hostname  // Production: ".example.com"
        : 'localhost';  // Dev: "localhost" applies to all ports on same host

      const cookieOptions = {
        httpOnly: true,
        secure: isProduction,  // false on localhost, true in production
        sameSite: isProduction ? 'none' as const : 'lax' as const,
        path: '/',
        domain: domain,  // KEY FIX: explicit domain for cross-port cookie sharing
      };

      res.cookie('accessToken', result.accessToken, { 
        ...cookieOptions, 
        maxAge: 15 * 60 * 1000  // 15 minutes
      });
      res.cookie('refreshToken', result.refreshToken, { 
        ...cookieOptions, 
        maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days
      });
      res.cookie('jid', result.refreshToken, { 
        ...cookieOptions, 
        maxAge: 7 * 24 * 60 * 60 * 1000 
      });
      
      this.logger.log(`Auth cookies set with domain: ${domain}, secure: ${isProduction}`);
    } catch (err) {
      this.logger.warn('Failed to set auth cookies on login: ' + (err?.message || err));
    }

    return result;
  }

  @Post('forgot-password')
  @UseGuards(BotDetectionGuard)
  @Throttle({ default: { limit: 3, ttl: 60000 } }) // 3 password reset requests per minute
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authsService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @UseGuards(BotDetectionGuard)
  @Throttle({ default: { limit: 3, ttl: 60000 } }) // 3 password resets per minute
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authsService.resetPassword(resetPasswordDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  logout() {
    return this.authsService.logout();
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getCurrentUser(@Req() req) {
    const authId = req.user?.sub || req.user?.id;
    return this.authsService.getCurrentUser(authId);
  }

  @Post('refresh-token')
  @UseGuards(BotDetectionGuard)
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 token refreshes per minute
  refreshToken(@Body('token') token: string) {
    return this.authsService.refreshToken(token);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    // This route initiates the Google OAuth flow
    // Passport will redirect to Google login
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    // req.user is already the result from GoogleStrategy.validate
    // which includes accessToken, refreshToken, and user info
    if (!req.user) {
      return res.status(401).json({ 
        message: 'Google authentication failed',
        error: 'No user data returned from Google' 
      });
    }
    // Set httpOnly cookies for tokens so frontend middleware can detect authentication
    try {
      const frontendUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:3001';
      const isProduction = (this.configService.get('NODE_ENV') || 'development') === 'production' || frontendUrl.startsWith('https');
      
      // Determine cookie domain - critical for cross-port/localhost scenarios
      const domain = isProduction 
        ? '.' + new URL(frontendUrl).hostname  // Production: ".example.com"
        : 'localhost';  // Dev: "localhost" applies to all ports on same host

      const accessToken = req.user.accessToken;
      const refreshToken = req.user.refreshToken;

      // Set cookies (accessToken, refreshToken, jid) as httpOnly with proper domain
      const cookieOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' as const : 'lax' as const,
        path: '/',
        domain: domain,  // KEY FIX: explicit domain for cross-port cookie sharing
      };

      res.cookie('accessToken', accessToken, { 
        ...cookieOptions, 
        maxAge: 15 * 60 * 1000 
      });
      res.cookie('refreshToken', refreshToken, { 
        ...cookieOptions, 
        maxAge: 7 * 24 * 60 * 60 * 1000 
      });
      res.cookie('jid', refreshToken, { 
        ...cookieOptions, 
        maxAge: 7 * 24 * 60 * 60 * 1000 
      });

      // Always redirect user to dashboard after successful OAuth
      const redirectTo = `${frontendUrl}/dashboard`;
      this.logger.log(`OAuth: Auth cookies set with domain: ${domain}, redirecting to ${redirectTo}`);
      return res.redirect(redirectTo);
    } catch (err) {
      this.logger.error('OAuth: Failed to set auth cookies: ' + (err?.message || err));
      return res.status(500).json({ message: 'Failed to set auth cookies', error: err?.message });
    }
  }
}
