import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthUserDto } from './dto/auth-user.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { AuthUserResult, AuthResponse } from '../libs/types/auth.type'; // Updated import
import { TokenFactory } from '../common/factories/token.factory';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private tokenFactory: TokenFactory,
  ) {}

  async validateUser(email: string, pass: string): Promise<AuthUserResult> {
    const user = await this.usersService.findByEmail(email);
    if (!user || !(await bcrypt.compare(pass, user.hashPassword))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const { hashPassword, ...result } = user;
    return result;
  }

  async login(userDto: AuthUserDto): Promise<AuthResponse> {
    const user = await this.validateUser(userDto.email, userDto.password);
    const payload = { email: user.email, sub: user.id, role: user.role };
    return this.tokenFactory.createToken(payload);
  }

  async register(createUserDto: CreateUserDto): Promise<AuthResponse> {
    // Updated return type
    const existingUser = await this.usersService.findByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
    const user = await this.usersService.create(createUserDto);
    const payload = { email: user.email, sub: user.id, role: user.role };
    return this.tokenFactory.createToken(payload);
  }
}
