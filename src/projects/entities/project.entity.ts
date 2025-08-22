import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ProjectStatus } from '../../libs/enums/project-status.enum';
import { Client } from '../../clients/entities/client.entity'; // Assuming Client entity exists

@Entity('projects')
export class Project {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', description: 'Project ID (UUID)' })
  @PrimaryGeneratedColumn('uuid') // Changed to UUID
  id: string;

  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', description: 'ID of the client associated with the project' })
  @Column({ type: 'uuid' }) // Changed type to uuid
  clientId: string; // Foreign key column

  @ManyToOne(() => Client)
  @JoinColumn({ name: 'clientId' }) // Specify the foreign key column
  client: Client; // Relationship to Client entity

  @ApiProperty({ example: 'USA', description: 'Country where the project is being executed' })
  @Column({ type: 'varchar', length: 255 })
  country: string;

  @ApiProperty({ example: ['legal', 'finance'], description: 'Services needed for the project' })
  @Column({ type: 'json' }) // Store array as JSON
  servicesNeeded: string[];

  @ApiProperty({ example: 50000, description: 'Budget allocated for the project' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  budget: number;

  @ApiProperty({ example: ProjectStatus.ACTIVE, enum: ProjectStatus, description: 'Current status of the project' })
  @Column({ type: 'enum', enum: ProjectStatus, default: ProjectStatus.DRAFT })
  status: ProjectStatus;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}