import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from 'src/projects/entities/project.entity';
import { CreateProjectDto } from 'src/projects/dto/create-project.dto';
import { UpdateProjectDto } from 'src/projects/dto/update-project.dto';
import { ClientsService } from 'src/clients/clients.service'; // Absolute path
import { User } from 'src/users/entities/user.entity';
import { ROLES } from 'src/libs/types/user.type';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly clientsService: ClientsService, // Inject ClientsService
  ) {}

  async create(createProjectDto: CreateProjectDto, user: User): Promise<Project> {
    if (user.role === ROLES.CLIENT && createProjectDto.clientId !== user.id) {
      throw new ForbiddenException('Clients can only create projects for their own client ID.');
    }
    // Ensure the client exists
    await this.clientsService.findOne(createProjectDto.clientId);

    const project = this.projectRepository.create(createProjectDto);
    return this.projectRepository.save(project);
  }

  async findAll(page: number, limit: number, user: User): Promise<[Project[], number]> {
    const skip = (page - 1) * limit;
    const whereCondition = user.role === ROLES.CLIENT ? { clientId: user.id } : {};

    const [data, total] = await this.projectRepository.findAndCount({
      where: whereCondition,
      skip,
      take: limit,
      relations: ['client'], // Load client relation
    });
    return [data, total];
  }

  async findOne(id: string, user: User): Promise<Project> {
    const whereCondition = user.role === ROLES.CLIENT ? { id, clientId: user.id } : { id };

    const project = await this.projectRepository.findOne({
      where: whereCondition,
      relations: ['client'], // Load client relation
    });
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return project;
  }

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
    user: User,
  ): Promise<Project> {
    const project = await this.findOne(id, user); // Reuses findOne for existence check and authorization

    // If clientId is updated, ensure the new client exists and client is authorized
    if (updateProjectDto.clientId) {
      if (user.role === ROLES.CLIENT && updateProjectDto.clientId !== user.id) {
        throw new ForbiddenException('Clients can only update projects for their own client ID.');
      }
      await this.clientsService.findOne(updateProjectDto.clientId);
    }

    Object.assign(project, updateProjectDto);
    return this.projectRepository.save(project);
  }

  async remove(id: string): Promise<void> {
    const result = await this.projectRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
  }

  async findProjectsByCountry(country: string): Promise<Project[]> {
    return this.projectRepository.find({ where: { country } });
  }
}