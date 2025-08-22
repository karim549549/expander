import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateClientDto {
  @ApiProperty({ example: 'Global Solutions Inc.', description: 'Name of the client company' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  companyName: string;

  @ApiProperty({ example: 'info@globalsolutions.com', description: 'Contact email for the client' })
  @IsEmail()
  @MaxLength(255)
  contactEmail: string;
}