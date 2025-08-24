import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Project } from './entities/project.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ROLES } from '../libs/types/user.type';
import {
  ApiCreateProjectOperation,
  ApiFindAllProjectsOperation,
  ApiFindOneProjectOperation,
  ApiUpdateProjectOperation,
  ApiRemoveProjectOperation,
  ApiPaginatedResponse,
} from '../common/decorators/swagger-responses.decorator';
import { PaginationResponse } from '../common/responses/pagination-response';
import type { CustomRequest } from '../libs/types/request.type';

@ApiTags('projects')
@Controller('projects')
@ApiBearerAuth() // Apply to all endpoints in this controller
@UseGuards(JwtAuthGuard, RolesGuard) // Apply to all endpoints in this controller
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiCreateProjectOperation(
    'Create a new project',
    CreateProjectDto,
    'Project created successfully',
  )
  @Roles(ROLES.ADMIN, ROLES.CLIENT) // Admins or Clients can create projects
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @Req() req: CustomRequest,
  ): Promise<Project> {
    return this.projectsService.create(createProjectDto, req.user);
  }

  @Get()
  @ApiFindAllProjectsOperation('Get all projects', 'List of all projects')
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (default: 10)',
  })
  @ApiPaginatedResponse(Project)
  @Roles(ROLES.ADMIN, ROLES.CLIENT) // Admins or Clients can view projects
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Req() req: CustomRequest,
  ): Promise<PaginationResponse<Project>> {
    const [data, total] = await this.projectsService.findAll(
      page,
      limit,
      req.user,
    );
    return new PaginationResponse(data, total, page, limit);
  }

  @Get(':id')
  @ApiFindOneProjectOperation('Get a project by ID', 'Project details')
  @Roles(ROLES.ADMIN, ROLES.CLIENT) // Admins or Clients can view projects
  async findOne(
    @Param('id') id: string,
    @Req() req: CustomRequest,
  ): Promise<Project> {
    return this.projectsService.findOne(id, req.user);
  }

  @Patch(':id')
  @ApiUpdateProjectOperation(
    'Update a project by ID',
    UpdateProjectDto,
    'Project updated successfully',
  )
  @Roles(ROLES.ADMIN, ROLES.CLIENT) // Admins or Clients can update projects
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @Req() req: CustomRequest,
  ): Promise<Project> {
    return this.projectsService.update(id, updateProjectDto, req.user);
  }

  @Delete(':id')
  @ApiRemoveProjectOperation(
    'Delete a project by ID',
    'Project deleted successfully',
  )
  @Roles(ROLES.ADMIN) // Only admins can delete projects
  async remove(@Param('id') id: string): Promise<void> {
    return this.projectsService.remove(id);
  }
}
