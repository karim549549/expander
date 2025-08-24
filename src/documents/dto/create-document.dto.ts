import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateDocumentDto {
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    description: 'ID of the project this document belongs to',
  })
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @ApiProperty({
    example: 'My New Document Title',
    description: 'The title of the document',
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'This is the detailed content of my document.',
    description: 'The main content of the document',
  })
  @IsString()
  content: string;

  @ApiProperty({
    example: ['report', 'finance'],
    description: 'Tags associated with the document',
    isArray: true,
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}
