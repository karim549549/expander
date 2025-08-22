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
  Request,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Project } from './entities/project.entity';
import { StandardResponse } from '../common/responses/standard-response';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ROLES } from '../libs/types/user.type';

@ApiTags('projects')
@Controller('projects')
@ApiBearerAuth() // Apply to all endpoints in this controller
@UseGuards(JwtAuthGuard, RolesGuard) // Apply to all endpoints in this controller
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  @ApiBody({ type: CreateProjectDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Project created successfully',
    type: StandardResponse,
  })
  @Roles(ROLES.ADMIN, ROLES.CLIENT) // Admins or Clients can create projects
  async create(@Body() createProjectDto: CreateProjectDto): Promise<StandardResponse<Project>> {
    // TODO: Add logic to ensure client can only create projects for their own clientId if not ADMIN
    const project = await this.projectsService.create(createProjectDto);
    return new StandardResponse(project, 'Project created successfully', HttpStatus.CREATED);
  }

  @Get()
  @ApiOperation({ summary: 'Get all projects' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all projects',
    type: StandardResponse,
  })
  @Roles(ROLES.ADMIN, ROLES.CLIENT) // Admins or Clients can view projects
  async findAll(@Request() req): Promise<StandardResponse<Project[]>> {
    // TODO: Add logic to filter projects by client if not ADMIN
    const projects = await this.projectsService.findAll();
    return new StandardResponse(projects, 'Projects retrieved successfully');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a project by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Project details',
    type: StandardResponse,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Project not found' })
  @Roles(ROLES.ADMIN, ROLES.CLIENT) // Admins or Clients can view projects
  async findOne(@Param('id') id: string, @Request() req): Promise<StandardResponse<Project>> {
    // TODO: Add logic to ensure client can only view their own project if not ADMIN
    const project = await this.projectsService.findOne(id); // Removed +
    return new StandardResponse(project, 'Project retrieved successfully');
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a project by ID' })
  @ApiBody({ type: UpdateProjectDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Project updated successfully',
    type: StandardResponse,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Project not found' })
  @Roles(ROLES.ADMIN, ROLES.CLIENT) // Admins or Clients can update projects
  async update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto): Promise<StandardResponse<Project>> {
    // TODO: Add logic to ensure client can only update their own project if not ADMIN
    const project = await this.projectsService.update(id, updateProjectDto); // Removed +
    return new StandardResponse(project, 'Project updated successfully');
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a project by ID' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Project deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Project not found' })
  @Roles(ROLES.ADMIN) // Only admins can delete projects
  async remove(@Param('id') id: string): Promise<StandardResponse<void>> {
    await this.projectsService.remove(id); // Removed +
    return new StandardResponse(undefined, 'Project deleted successfully', HttpStatus.NO_CONTENT);
  }
}