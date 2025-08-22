import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from 'src/projects/entities/project.entity';
import { CreateProjectDto } from 'src/projects/dto/create-project.dto';
import { UpdateProjectDto } from 'src/projects/dto/update-project.dto';
import { ClientsService } from 'src/clients/clients.service'; // Absolute path

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly clientsService: ClientsService, // Inject ClientsService
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    // Ensure the client exists
    await this.clientsService.findOne(createProjectDto.clientId);

    const project = this.projectRepository.create(createProjectDto);
    return this.projectRepository.save(project);
  }

  async findAll(): Promise<Project[]> {
    return this.projectRepository.find({ relations: ['client'] }); // Load client relation
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
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
  ): Promise<Project> {
    const project = await this.findOne(id); // Reuses findOne for existence check

    // If clientId is updated, ensure the new client exists
    if (updateProjectDto.clientId) {
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
}