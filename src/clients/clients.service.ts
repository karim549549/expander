import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from 'src/clients/entities/client.entity';
import { CreateClientDto } from 'src/clients/dto/create-client.dto';
import { UpdateClientDto } from 'src/clients/dto/update-client.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async create(createClientDto: CreateClientDto, user: User): Promise<Client> {
    const client = this.clientRepository.create({
      ...createClientDto,
      contactEmail: user.email,
      userId: user.id,
    });
    return await this.clientRepository.save(client);
  }

  async findClientProfile(user: User): Promise<Client> {
    const client = await this.clientRepository.findOne({
      where: { userId: user.id },
    });
    if (!client) {
      throw new NotFoundException(
        `Client profile not found for user ${user.id}`,
      );
    }
    return client;
  }

  async updateClientProfile(
    updateClientDto: UpdateClientDto,
    user: User,
  ): Promise<Client> {
    const client = await this.findClientProfile(user);
    Object.assign(client, updateClientDto);
    return await this.clientRepository.save(client);
  }

  async findAll(page: number, limit: number): Promise<[Client[], number]> {
    const skip = (page - 1) * limit;
    const [data, total] = await this.clientRepository.findAndCount({
      skip,
      take: limit,
    });
    return [data, total];
  }

  async findOne(id: string): Promise<Client> {
    const client = await this.clientRepository.findOne({ where: { id } });
    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    return client;
  }

  async update(id: string, updateClientDto: UpdateClientDto): Promise<Client> {
    const client = await this.findOne(id);
    Object.assign(client, updateClientDto);
    return await this.clientRepository.save(client);
  }

  async remove(id: string): Promise<void> {
    const result = await this.clientRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
  }
}
