import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { Document, DocumentSchema } from './schemas/document.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Document.name, schema: DocumentSchema }]),
  ],
  providers: [DocumentsService],
  controllers: [DocumentsController],
  exports: [DocumentsService], // Export service if it needs to be used by other modules
})
export class DocumentsModule {}
