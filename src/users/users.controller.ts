import {
  Controller,
  Post,
  Body,
  Get,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Request,
  HttpStatus, // New import
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ROLES } from '../libs/types/user.type';
import { StandardResponse } from '../common/responses/standard-response'; // New import

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiOkResponse({ description: 'List of users', type: StandardResponse }) // Updated type
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.ADMIN)
  async findAll(@Request() req): Promise<StandardResponse<User[]>> {
    // Updated return type
    console.log('User from JWT:', req.user);
    const users = await this.users.findAll();
    return new StandardResponse(users, 'Users retrieved successfully');
  }
}
