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
import { VendorsService } from './vendors.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Vendor } from './entities/vendor.entity';
import { StandardResponse } from '../common/responses/standard-response';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ROLES } from '../libs/types/user.type';

@ApiTags('vendors')
@Controller('vendors')
@ApiBearerAuth() // Apply to all endpoints in this controller
@UseGuards(JwtAuthGuard, RolesGuard) // Apply to all endpoints in this controller
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new vendor' })
  @ApiBody({ type: CreateVendorDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Vendor created successfully',
    type: StandardResponse,
  })
  @Roles(ROLES.ADMIN) // Only admins can create vendors
  async create(@Body() createVendorDto: CreateVendorDto): Promise<StandardResponse<Vendor>> {
    const vendor = await this.vendorsService.create(createVendorDto);
    return new StandardResponse(vendor, 'Vendor created successfully', HttpStatus.CREATED);
  }

  @Get()
  @ApiOperation({ summary: 'Get all vendors' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all vendors',
    type: StandardResponse,
  })
  @Roles(ROLES.ADMIN, ROLES.CLIENT) // Admins can view all vendors, clients can view vendors
  async findAll(): Promise<StandardResponse<Vendor[]>> {
    const vendors = await this.vendorsService.findAll();
    return new StandardResponse(vendors, 'Vendors retrieved successfully');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a vendor by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Vendor details',
    type: StandardResponse,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Vendor not found' })
  @Roles(ROLES.ADMIN, ROLES.CLIENT) // Admins can view any vendor, clients can view vendors
  async findOne(@Param('id') id: string): Promise<StandardResponse<Vendor>> {
    const vendor = await this.vendorsService.findOne(+id);
    return new StandardResponse(vendor, 'Vendor retrieved successfully');
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a vendor by ID' })
  @ApiBody({ type: UpdateVendorDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Vendor updated successfully',
    type: StandardResponse,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Vendor not found' })
  @Roles(ROLES.ADMIN) // Only admins can update vendors
  async update(@Param('id') id: string, @Body() updateVendorDto: UpdateVendorDto): Promise<StandardResponse<Vendor>> {
    const vendor = await this.vendorsService.update(+id, updateVendorDto);
    return new StandardResponse(vendor, 'Vendor updated successfully');
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a vendor by ID' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Vendor deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Vendor not found' })
  @Roles(ROLES.ADMIN) // Only admins can delete vendors
  async remove(@Param('id') id: string): Promise<StandardResponse<void>> {
    await this.vendorsService.remove(+id);
    return new StandardResponse(undefined, 'Vendor deleted successfully', HttpStatus.NO_CONTENT);
  }
}