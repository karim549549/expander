import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { Project } from './entities/project.entity';
import { ClientsModule } from '../clients/clients.module'; // Import ClientsModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Project]),
    ClientsModule, // Import ClientsModule as ProjectsService depends on ClientsService
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService], // Export ProjectsService if it needs to be used by other modules
})
export class ProjectsModule {}