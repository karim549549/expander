import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { ROLES } from 'src/libs/types/user.type';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async create(dto: CreateUserDto) {
    const saltRounds = 10;
    const hashed = await bcrypt.hash(dto.password, saltRounds);
    const user = this.repo.create({
      email: dto.email,
      hashPassword: hashed,
      companyName: dto.companyName,
      role: ROLES.CLIENT,
    });
    return this.repo.save(user);
  }

  findAll() {
    return this.repo.find();
  }

  findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }
}
