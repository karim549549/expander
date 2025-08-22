import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';
import { ProjectStatus } from '../../libs/enums/project-status.enum';

export class CreateProjectDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', description: 'ID of the client associated with the project' })
  @IsString() // Changed from IsInt
  @IsNotEmpty() // Added IsNotEmpty for string UUID
  clientId: string;

  @ApiProperty({ example: 'USA', description: 'Country where the project is being executed' })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({ example: ['legal', 'finance'], description: 'Services needed for the project' })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  servicesNeeded: string[];

  @ApiProperty({ example: 50000.00, description: 'Budget allocated for the project' })
  @IsNumber()
  @Min(0)
  budget: number;

  @ApiProperty({ example: ProjectStatus.DRAFT, enum: ProjectStatus, description: 'Initial status of the project' })
  @IsEnum(ProjectStatus)
  status: ProjectStatus;
}