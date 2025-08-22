import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Client } from './entities/client.entity';
import { StandardResponse } from '../common/responses/standard-response';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ROLES } from '../libs/types/user.type';

@ApiTags('clients')
@Controller('clients')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new client' })
  @ApiBody({ type: CreateClientDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Client created successfully',
    type: StandardResponse,
  })
  @Roles(ROLES.CLIENT)
  async create(
    @Body() createClientDto: CreateClientDto,
  ): Promise<StandardResponse<Client>> {
    const client = await this.clientsService.create(createClientDto);
    return new StandardResponse(
      client,
      'Client created successfully',
      HttpStatus.CREATED,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all clients' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all clients',
    type: StandardResponse,
  })
  @Roles(ROLES.ADMIN, ROLES.CLIENT) // Only admins can view all clients
  async findAll(): Promise<StandardResponse<Client[]>> {
    const clients = await this.clientsService.findAll();
    return new StandardResponse(clients, 'Clients retrieved successfully');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a client by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Client details',
    type: StandardResponse,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Client not found',
  })
  @Roles(ROLES.ADMIN, ROLES.CLIENT) // Admins can view any client, clients can view their own
  async findOne(
    @Param('id') id: string,
    @Request() req,
  ): Promise<StandardResponse<Client>> {
    // TODO: Add logic to ensure client can only view their own data if not ADMIN
    const client = await this.clientsService.findOne(id); // Removed +
    return new StandardResponse(client, 'Client retrieved successfully');
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a client by ID' })
  @ApiBody({ type: UpdateClientDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Client updated successfully',
    type: StandardResponse,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Client not found',
  })
  @Roles(ROLES.ADMIN, ROLES.CLIENT) // Admins can update any client, clients can update their own
  async update(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
  ): Promise<StandardResponse<Client>> {
    // TODO: Add logic to ensure client can only update their own data if not ADMIN
    const client = await this.clientsService.update(id, updateClientDto); // Removed +
    return new StandardResponse(client, 'Client updated successfully');
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a client by ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Client deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Client not found',
  })
  @Roles(ROLES.ADMIN) // Only admins can delete clients
  async remove(@Param('id') id: string): Promise<StandardResponse<void>> {
    await this.clientsService.remove(id); // Removed +
    return new StandardResponse(
      undefined,
      'Client deleted successfully',
      HttpStatus.NO_CONTENT,
    );
  }
}
