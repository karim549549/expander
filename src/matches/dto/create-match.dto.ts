import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateMatchDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', description: 'ID of the project associated with the match' })
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', description: 'ID of the vendor associated with the match' })
  @IsString()
  @IsNotEmpty()
  vendorId: string;

  @ApiProperty({ example: 85.5, description: 'Matching score between project and vendor' })
  @IsNumber()
  @Min(0)
  score: number;
}