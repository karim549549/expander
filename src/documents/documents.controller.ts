import {
  Controller,
  Post,
  Get,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'; // Added UsePipes, ValidationPipe
import { DocumentsService } from './documents.service';
import { Document } from './schemas/document.schema';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBody, // Added ApiBody for DTO
} from '@nestjs/swagger';
import { CreateDocumentDto } from './dto/create-document.dto'; // New import

@ApiTags('documents')
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new document' })
  @ApiBody({ type: CreateDocumentDto }) // Added ApiBody
  @ApiCreatedResponse({
    description: 'Document created successfully',
    type: Document,
  })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true })) // Added ValidationPipe
  async create(
    @Body() createDocumentDto: CreateDocumentDto,
  ): Promise<Document> {
    return this.documentsService.create(createDocumentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all documents' })
  @ApiOkResponse({ description: 'List of all documents', type: [Document] })
  async findAll(): Promise<Document[]> {
    return this.documentsService.findAll();
  }
}
