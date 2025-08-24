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
  Query,
} from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { Vendor } from './entities/vendor.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ROLES } from '../libs/types/user.type';
import {
  ApiCreateVendorOperation,
  ApiFindAllVendorsOperation,
  ApiFindOneVendorOperation,
  ApiUpdateVendorOperation,
  ApiRemoveVendorOperation,
  ApiPaginatedResponse,
} from '../common/decorators/swagger-responses.decorator';
import { PaginationResponse } from '../common/responses/pagination-response';

@ApiTags('vendors')
@Controller('vendors')
@ApiBearerAuth() // Apply to all endpoints in this controller
@UseGuards(JwtAuthGuard, RolesGuard) // Apply to all endpoints in this controller
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @Post()
  @ApiCreateVendorOperation('Create a new vendor', CreateVendorDto, 'Vendor created successfully')
  @Roles(ROLES.ADMIN) // Only admins can create vendors
  async create(@Body() createVendorDto: CreateVendorDto): Promise<Vendor> {
    return this.vendorsService.create(createVendorDto);
  }

  @Get()
  @ApiFindAllVendorsOperation('Get all vendors', 'List of all vendors')
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
  @ApiPaginatedResponse(Vendor)
  @Roles(ROLES.ADMIN, ROLES.CLIENT) // Admins can view all vendors, clients can view vendors
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<PaginationResponse<Vendor>> {
    const [data, total] = await this.vendorsService.findAll(page, limit);
    return new PaginationResponse(data, total, page, limit);
  }

  @Get(':id')
  @ApiFindOneVendorOperation('Get a vendor by ID', 'Vendor details')
  @Roles(ROLES.ADMIN, ROLES.CLIENT) // Admins can view any vendor, clients can view vendors
  async findOne(@Param('id') id: string): Promise<Vendor> {
    return this.vendorsService.findOne(id);
  }

  @Patch(':id')
  @ApiUpdateVendorOperation('Update a vendor by ID', UpdateVendorDto, 'Vendor updated successfully')
  @Roles(ROLES.ADMIN) // Only admins can update vendors
  async update(@Param('id') id: string, @Body() updateVendorDto: UpdateVendorDto): Promise<Vendor> {
    return this.vendorsService.update(id, updateVendorDto);
  }

  @Delete(':id')
  @ApiRemoveVendorOperation('Delete a vendor by ID', 'Vendor deleted successfully')
  @Roles(ROLES.ADMIN) // Only admins can delete vendors
  async remove(@Param('id') id: string): Promise<void> {
    return this.vendorsService.remove(id);
  }
}