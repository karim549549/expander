import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger'; // New import

export type DocumentDocument = HydratedDocument<Document>;

@Schema()
export class Document {
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    description: 'ID of the project this document belongs to',
  })
  @Prop({ required: true, index: true }) // Add index for efficient lookup
  projectId: string;

  @ApiProperty({ example: 'My Document Title' }) // Added ApiProperty
  @Prop({ required: true })
  title: string;

  @ApiProperty({ example: 'This is the content of my document.' }) // Added ApiProperty
  @Prop({ required: true })
  content: string;

  @ApiProperty({ example: ['tag1', 'tag2'], isArray: true }) // Added ApiProperty
  @Prop([String]) // Array of strings for tags
  tags: string[];
}

export const DocumentSchema = SchemaFactory.createForClass(Document);
