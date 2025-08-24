import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateClientDto {
  @ApiProperty({ example: 'Global Solutions Inc.', description: 'Name of the client company' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  companyName: string;
}