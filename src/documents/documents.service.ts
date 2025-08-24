import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Document, DocumentDocument } from './schemas/document.schema';
import { CreateDocumentDto } from './dto/create-document.dto';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel(Document.name) private documentModel: Model<DocumentDocument>,
  ) {}

  async create(createDocumentDto: CreateDocumentDto): Promise<Document> {
    const createdDocument = new this.documentModel(createDocumentDto);
    return createdDocument.save();
  }

  async findAll(page: number, limit: number): Promise<[Document[], number]> {
    const skip = (page - 1) * limit;
    const data = await this.documentModel.find().skip(skip).limit(limit).exec();
    const total = await this.documentModel.countDocuments().exec();
    return [data, total];
  }

  async findByProject(projectId: string): Promise<Document[]> {
    return this.documentModel.find({ projectId }).exec();
  }

  async findByTag(tag: string): Promise<Document[]> {
    return this.documentModel.find({ tags: tag }).exec();
  }

  async findByText(searchText: string): Promise<Document[]> {
    return this.documentModel
      .find({
        $or: [
          { title: { $regex: searchText, $options: 'i' } },
          { content: { $regex: searchText, $options: 'i' } },
        ],
      })
      .exec();
  }
}
