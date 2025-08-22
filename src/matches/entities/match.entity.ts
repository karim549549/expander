import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Project } from '../../projects/entities/project.entity'; // Assuming Project entity exists
import { Vendor } from '../../vendors/entities/vendor.entity'; // Assuming Vendor entity exists

@Entity('matches')
export class Match {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', description: 'ID of the project associated with the match' })
  @Column({ type: 'uuid' }) // Changed type to uuid
  projectId: string; // Foreign key column

  @ManyToOne(() => Project)
  @JoinColumn({ name: 'projectId' })
  project: Project; // Relationship to Project entity

  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', description: 'ID of the vendor associated with the match' })
  @Column({ type: 'uuid' }) // Changed type to uuid
  vendorId: string; // Foreign key column

  @ManyToOne(() => Vendor)
  @JoinColumn({ name: 'vendorId' })
  vendor: Vendor; // Relationship to Vendor entity

  @ApiProperty({ example: 85.5, description: 'Matching score between project and vendor' })
  @Column({ type: 'decimal', precision: 5, scale: 2 }) // e.g., 85.50
  score: number;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}