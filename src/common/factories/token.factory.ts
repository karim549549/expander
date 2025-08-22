import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  AuthResponse,
  JwtPayload,
  token_type,
} from '../../libs/types/auth.type';
import { ConfigService } from '@nestjs/config';
import { JWT_EXPIRATION_KEY, JWT_SECRET_KEY } from '../constants/database.constants'; // New import

@Injectable()
export class TokenFactory {
  constructor(
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private parseExpiresIn(expiresIn: string): number {
    const value = parseInt(expiresIn.slice(0, -1), 10);
    const unit = expiresIn.slice(-1);

    switch (unit) {
      case 's': return value * 1000; // seconds to milliseconds
      case 'm': return value * 60 * 1000; // minutes to milliseconds
      case 'h': return value * 60 * 60 * 1000; // hours to milliseconds
      case 'd': return value * 24 * 60 * 60 * 1000; // days to milliseconds
      default: return parseInt(expiresIn, 10) * 1000; // Assume seconds if no unit
    }
  }

  createToken(payload: JwtPayload): AuthResponse {
    const expiresInDuration = this.configService.get<string>(JWT_EXPIRATION_KEY) || '60s';
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>(JWT_SECRET_KEY),
      expiresIn: expiresInDuration,
    });

    const expirationTimestampMs = Date.now() + this.parseExpiresIn(expiresInDuration);
    const expires_in = new Date(expirationTimestampMs).toISOString(); // Convert to ISO string

    return {
      token,
      expires_in,
      token_type: token_type.access_token,
    };
  }
}
