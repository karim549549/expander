import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Document, DocumentDocument } from './schemas/document.schema';
import { CreateDocumentDto } from './dto/create-document.dto'; // New import

@Injectable()
export class DocumentsService {
  constructor(@InjectModel(Document.name) private documentModel: Model<DocumentDocument>) {}

  async create(createDocumentDto: CreateDocumentDto): Promise<Document> {
    const createdDocument = new this.documentModel(createDocumentDto);
    return createdDocument.save();
  }

  async findAll(): Promise<Document[]> {
    return this.documentModel.find().exec();
  }
}