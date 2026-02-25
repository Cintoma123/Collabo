import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthsService } from '../auths.service';

/**
 * Custom JWT extractor that checks multiple sources:
 * 1. Authorization: Bearer <token> header
 * 2. accessToken cookie
 * 
 * This allows both API clients (using Bearer token) and frontend (using cookies) to authenticate
 */
const extractJwtFromRequestOrCookie = (req: any) => {
  // First, try to extract from Authorization header
  let token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
  
  if (!token && req && req.cookies) {
    // Try to extract from accessToken cookie
    token = req.cookies.accessToken || req.cookies.accessToken;
  }
  
  // Also check in raw cookie header for direct parsing
  if (!token && req && req.headers && req.headers.cookie) {
    const cookies = req.headers.cookie.split(';').reduce((acc: any, cookie: string) => {
      const [name, value] = cookie.trim().split('=');
      if (name === 'accessToken') {
        return decodeURIComponent(value);
      }
      return acc;
    }, null);
    
    if (cookies) {
      token = cookies;
    }
  }
  
  return token;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private authService: AuthsService,
  ) {
    super({
      jwtFromRequest: extractJwtFromRequestOrCookie,
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    return { sub: payload.sub, userId: payload.sub, email: payload.email };
  }
}
