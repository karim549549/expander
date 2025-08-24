import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthUserDto } from './dto/auth-user.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthResponse } from '../libs/types/auth.type';
import {
  ApiAuthOperation,
  ApiRegisterOperation,
} from '../common/decorators/swagger-responses.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiAuthOperation('User login', AuthUserDto, 'User successfully logged in.')
  async login(@Body() userDto: AuthUserDto): Promise<AuthResponse> {
    return this.authService.login(userDto);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiRegisterOperation(
    'Register a new user',
    CreateUserDto,
    'User successfully registered.',
  )
  async register(@Body() createUserDto: CreateUserDto): Promise<AuthResponse> {
    return this.authService.register(createUserDto);
  }
}
