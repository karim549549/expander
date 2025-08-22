import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('vendors')
export class Vendor {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Global Legal Solutions Inc.' })
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty({ example: ['USA', 'Canada'], description: 'Countries supported by the vendor' })
  @Column({ type: 'json' })
  countriesSupported: string[];

  @ApiProperty({ example: ['legal_advice', 'tax_consulting'], description: 'Services offered by the vendor' })
  @Column({ type: 'json' })
  servicesOffered: string[];

  @ApiProperty({ example: 4.5, description: 'Average rating of the vendor' })
  @Column({ type: 'decimal', precision: 3, scale: 2 }) // e.g., 4.50
  rating: number;

  @ApiProperty({ example: 24, description: 'Response SLA in hours' })
  @Column({ type: 'int' })
  responseSlaHours: number;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}