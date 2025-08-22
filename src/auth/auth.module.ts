import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import {
  JWT_SECRET_KEY,
  JWT_EXPIRATION_KEY,
} from '../common/constants/database.constants';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TokenFactory } from '../common/factories/token.factory';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>(JWT_SECRET_KEY),
        signOptions: {
          expiresIn: configService.get<string>(JWT_EXPIRATION_KEY) || '60s',
        },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy, TokenFactory],
  controllers: [AuthController],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
