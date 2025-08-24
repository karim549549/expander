import { Query } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Client } from './entities/client.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ROLES } from '../libs/types/user.type';
import {
  ApiCreateClientOperation,
  ApiFindAllClientsOperation,
  ApiFindOneClientOperation,
  ApiUpdateClientOperation,
  ApiRemoveClientOperation,
} from '../common/decorators/swagger-responses.decorator';
import type { CustomRequest } from '../libs/types/request.type';
import { PaginationResponse } from '../common/responses/pagination-response';
import {
  Req,
  UseGuards,
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Delete,
  Body,
} from '@nestjs/common';

@ApiTags('clients')
@Controller('clients')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @ApiCreateClientOperation(
    'Create a new client',
    CreateClientDto,
    'Client created successfully',
  )
  @Roles(ROLES.CLIENT)
  async create(
    @Body() createClientDto: CreateClientDto,
    @Req() req: CustomRequest,
  ): Promise<Client> {
    return this.clientsService.create(createClientDto, req.user);
  }

  @Get('profile')
  @ApiFindOneClientOperation('Get client profile', 'Client profile details')
  @Roles(ROLES.CLIENT)
  async findClientProfile(@Req() req: CustomRequest): Promise<Client> {
    return this.clientsService.findClientProfile(req.user);
  }

  @Patch('profile')
  @ApiUpdateClientOperation(
    'Update client profile',
    UpdateClientDto,
    'Client profile updated successfully',
  )
  @Roles(ROLES.CLIENT)
  async updateClientProfile(
    @Body() updateClientDto: UpdateClientDto,
    @Req() req: CustomRequest,
  ): Promise<Client> {
    return this.clientsService.updateClientProfile(updateClientDto, req.user);
  }

  @Get()
  @ApiFindAllClientsOperation('Get all clients (Admin)', 'List of all clients')
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (default: 10)',
  })
  @Roles(ROLES.ADMIN)
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<PaginationResponse<Client>> {
    const [data, total] = await this.clientsService.findAll(page, limit);
    return new PaginationResponse(data, total, page, limit);
  }

  @Get(':id')
  @ApiFindOneClientOperation('Get a client by ID (Admin)', 'Client details')
  @Roles(ROLES.ADMIN)
  async findOne(@Param('id') id: string): Promise<Client> {
    return this.clientsService.findOne(id);
  }

  @Patch(':id')
  @ApiUpdateClientOperation(
    'Update a client by ID (Admin)',
    UpdateClientDto,
    'Client updated successfully',
  )
  @Roles(ROLES.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
  ): Promise<Client> {
    return this.clientsService.update(id, updateClientDto);
  }

  @Delete(':id')
  @ApiRemoveClientOperation(
    'Delete a client by ID (Admin)',
    'Client deleted successfully',
  )
  @Roles(ROLES.ADMIN)
  async remove(@Param('id') id: string): Promise<void> {
    return this.clientsService.remove(id);
  }
}
