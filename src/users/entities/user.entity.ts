import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  // Index, // Removed this import as it's no longer needed
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ROLES } from '../../libs/types/user.type';
@Entity({ name: 'users' })
export class User {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: string;

  @ApiProperty({ example: 'founder@example.com' })
  // @Index({ unique: true }) // Removed this line
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  hashPassword: string;

  @ApiProperty({ example: 'client' })
  @Column({ type: 'enum', enum: ROLES, default: ROLES.CLIENT })
  role: ROLES;

  @ApiProperty({ example: 'Acme Ltd' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  companyName?: string;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}