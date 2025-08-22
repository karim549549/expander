import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('clients')
export class Client {
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    description: 'Client ID (UUID)',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'Acme Corporation',
    description: 'Name of the client company',
  })
  @Column({ type: 'varchar', length: 255 })
  companyName: string;

  @ApiProperty({
    example: 'contact@acme.com',
    description: 'Contact email for the client',
  })
  @Column({ type: 'varchar', length: 255 })
  contactEmail: string;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
