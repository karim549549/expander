import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger'; // New import

export type DocumentDocument = HydratedDocument<Document>;

@Schema()
export class Document {
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