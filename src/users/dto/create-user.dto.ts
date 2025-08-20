import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'founder@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'strongPassword123' })
  @IsNotEmpty()
  @IsString()
  hashPassword: string;

  @ApiProperty({ example: 'Acme Ltd', required: false })
  @IsOptional()
  @IsString()
  companyName?: string;
}
