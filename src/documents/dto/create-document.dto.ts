import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsOptional } from 'class-validator';

export class CreateDocumentDto {
  @ApiProperty({ example: 'My New Document Title', description: 'The title of the document' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'This is the detailed content of the document.', description: 'The main content of the document' })
  @IsString()
  content: string;

  @ApiProperty({ example: ['report', 'finance'], description: 'Tags associated with the document', isArray: true, required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}
