import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  MaxLength,
} from 'class-validator';

export class CreateVendorDto {
  @ApiProperty({ example: 'Global Legal Solutions Inc.', description: 'Name of the vendor company' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: ['USA', 'Canada'], description: 'Countries supported by the vendor' })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  countriesSupported: string[];

  @ApiProperty({ example: ['legal_advice', 'tax_consulting'], description: 'Services offered by the vendor' })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  servicesOffered: string[];

  @ApiProperty({ example: 4.5, description: 'Average rating of the vendor (0.0 to 5.0)' })
  @IsNumber()
  @Min(0)
  rating: number;

  @ApiProperty({ example: 24, description: 'Response SLA in hours' })
  @IsInt()
  @Min(0)
  responseSlaHours: number;
}