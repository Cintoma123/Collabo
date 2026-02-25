import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class BotDetectionGuard implements CanActivate {
  private readonly suspiciousPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /automated/i,
    /curl/i,
    /wget/i,
  ];

  private readonly suspiciousHeaders = [
    'x-requested-with',
    'x-forwarded-for',
    'x-real-ip',
  ];

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    
    // Check User-Agent
    const userAgent = request.headers['user-agent'] || '';
    const isSuspiciousUserAgent = this.suspiciousPatterns.some(pattern => 
      pattern.test(userAgent)
    );

    // Check for missing common headers
    const hasCommonHeaders = !!(
      request.headers['accept'] && 
      request.headers['accept-language'] &&
      request.headers['accept-encoding']
    );

    // Check for suspicious header patterns
    const hasSuspiciousHeaders = this.suspiciousHeaders.some(header => 
      request.headers[header] !== undefined
    );

    // Check request timing (if available)
    const requestTime = request.headers['x-request-time'] || Date.now();
    const isTooFast = false; // Could implement timing checks here

    // Check request method patterns
    const isSuspiciousMethod = !['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method);

    // Check for excessive query parameters (potential scraping)
    const queryParamCount = Object.keys(request.query).length;
    const hasExcessiveParams = queryParamCount > 10;

    // Determine if request looks like a bot
    const isLikelyBot = 
      isSuspiciousUserAgent ||
      !hasCommonHeaders ||
      hasSuspiciousHeaders ||
      isTooFast ||
      isSuspiciousMethod ||
      hasExcessiveParams;

    if (isLikelyBot) {
      throw new ForbiddenException({
        message: 'Request blocked: suspicious activity detected',
        code: 'BOT_DETECTED',
        timestamp: new Date().toISOString(),
      });
    }

    return true;
  }
}