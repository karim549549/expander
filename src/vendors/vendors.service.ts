import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vendor } from 'src/vendors/entities/vendor.entity';
import { CreateVendorDto } from 'src/vendors/dto/create-vendor.dto';
import { UpdateVendorDto } from 'src/vendors/dto/update-vendor.dto';

@Injectable()
export class VendorsService {
  constructor(
    @InjectRepository(Vendor)
    private readonly vendorRepository: Repository<Vendor>,
  ) {}

  async create(createVendorDto: CreateVendorDto): Promise<Vendor> {
    const vendor = this.vendorRepository.create(createVendorDto);
    return this.vendorRepository.save(vendor);
  }

  async findAll(page: number, limit: number): Promise<[Vendor[], number]> {
    const skip = (page - 1) * limit;
    const [data, total] = await this.vendorRepository.findAndCount({
      skip,
      take: limit,
    });
    return [data, total];
  }

  async findOne(id: string): Promise<Vendor> {
    const vendor = await this.vendorRepository.findOne({ where: { id } });
    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }
    return vendor;
  }

  async update(id: string, updateVendorDto: UpdateVendorDto): Promise<Vendor> {
    const vendor = await this.findOne(id); // Reuses findOne for existence check
    Object.assign(vendor, updateVendorDto);
    return this.vendorRepository.save(vendor);
  }

  async remove(id: string): Promise<void> {
    const result = await this.vendorRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }
  }
}