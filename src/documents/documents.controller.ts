import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { Document } from './schemas/document.schema';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { CreateDocumentDto } from './dto/create-document.dto';
import { StandardResponse } from '../common/responses/standard-response';
import {
  ApiCreateDocumentOperation,
  ApiFindAllDocumentsOperation,
  ApiFindDocumentByProjectOperation,
  ApiFindDocumentByTagOperation,
  ApiFindDocumentByTextOperation,
  ApiPaginatedResponse,
} from '../common/decorators/swagger-responses.decorator';
import { PaginationResponse } from '../common/responses/pagination-response';

@ApiTags('documents')
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @ApiCreateDocumentOperation('Create a new document', CreateDocumentDto, 'Document created successfully')
  async create(
    @Body() createDocumentDto: CreateDocumentDto,
  ): Promise<Document> {
    return this.documentsService.create(createDocumentDto);
  }

  @Get()
  @ApiFindAllDocumentsOperation('Get all documents', 'List of all documents')
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
  @ApiPaginatedResponse(Document)
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<PaginationResponse<Document>> {
    const [data, total] = await this.documentsService.findAll(page, limit);
    return new PaginationResponse(data, total, page, limit);
  }

  @Get('project/:projectId')
  @ApiFindDocumentByProjectOperation('Get documents by project ID', 'List of documents for the project')
  @ApiParam({
    name: 'projectId',
    description: 'ID of the project',
    type: 'string',
  })
  async findByProject(
    @Param('projectId') projectId: string,
  ): Promise<Document[]> {
    return this.documentsService.findByProject(projectId);
  }

  @Get('tag/:tag')
  @ApiFindDocumentByTagOperation('Get documents by tag', 'List of documents with the specified tag')
  @ApiParam({ name: 'tag', description: 'Tag to search for', type: 'string' })
  async findByTag(
    @Param('tag') tag: string,
  ): Promise<Document[]> {
    return this.documentsService.findByTag(tag);
  }

  @Get('search/:searchText')
  @ApiFindDocumentByTextOperation('Search documents by text in title or content', 'List of documents matching the search text')
  @ApiParam({
    name: 'searchText',
    description: 'Text to search for in title or content',
    type: 'string',
  })
  async findByText(
    @Param('searchText') searchText: string,
  ): Promise<Document[]> {
    return this.documentsService.findByText(searchText);
  }
}
