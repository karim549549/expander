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
import { MatchesService } from './matches.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { Match } from './entities/match.entity';
import { StandardResponse } from '../common/responses/standard-response';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ROLES } from '../libs/types/user.type';

@ApiTags('matches')
@Controller('matches')
@ApiBearerAuth() // Apply to all endpoints in this controller
@UseGuards(JwtAuthGuard, RolesGuard) // Apply to all endpoints in this controller
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  // Basic CRUD endpoints for Match (optional, but good for completeness)
  @Post()
  @ApiOperation({ summary: 'Create a new match' })
  @ApiBody({ type: CreateMatchDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Match created successfully',
    type: StandardResponse,
  })
  @Roles(ROLES.ADMIN) // Only admins can create matches directly
  async create(@Body() createMatchDto: CreateMatchDto): Promise<StandardResponse<Match>> {
    const match = await this.matchesService.create(createMatchDto);
    return new StandardResponse(match, 'Match created successfully', HttpStatus.CREATED);
  }

  @Get()
  @ApiOperation({ summary: 'Get all matches' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all matches',
    type: StandardResponse,
  })
  @Roles(ROLES.ADMIN) // Only admins can view all matches
  async findAll(): Promise<StandardResponse<Match[]>> {
    const matches = await this.matchesService.findAll();
    return new StandardResponse(matches, 'Matches retrieved successfully');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a match by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Match details',
    type: StandardResponse,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Match not found' })
  @Roles(ROLES.ADMIN) // Only admins can view matches
  async findOne(@Param('id') id: string): Promise<StandardResponse<Match>> {
    const match = await this.matchesService.findOne(id);
    return new StandardResponse(match, 'Match retrieved successfully');
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a match by ID' })
  @ApiBody({ type: UpdateMatchDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Match updated successfully',
    type: StandardResponse,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Match not found' })
  @Roles(ROLES.ADMIN) // Only admins can update matches
  async update(@Param('id') id: string, @Body() updateMatchDto: UpdateMatchDto): Promise<StandardResponse<Match>> {
    const match = await this.matchesService.update(id, updateMatchDto);
    return new StandardResponse(match, 'Match updated successfully');
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a match by ID' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Match deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Match not found' })
  @Roles(ROLES.ADMIN) // Only admins can delete matches
  async remove(@Param('id') id: string): Promise<StandardResponse<void>> {
    await this.matchesService.remove(id);
    return new StandardResponse(undefined, 'Match deleted successfully', HttpStatus.NO_CONTENT);
  }

  // Project-Vendor Matching Endpoint
  @Post('/projects/:projectId/rebuild')
  @ApiOperation({ summary: 'Generate and rebuild vendor matches for a project' })
  @ApiParam({ name: 'projectId', description: 'ID of the project to rebuild matches for', type: 'string' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Vendor matches rebuilt successfully',
    type: StandardResponse,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Project not found' })
  @Roles(ROLES.ADMIN, ROLES.CLIENT) // Admins or Clients can trigger rebuild
  async rebuildMatches(@Param('projectId') projectId: string): Promise<StandardResponse<Match[]>> {
    const matches = await this.matchesService.rebuildMatchesForProject(projectId);
    return new StandardResponse(matches, 'Vendor matches rebuilt successfully');
  }
}