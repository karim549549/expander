import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { MatchesModule } from 'src/matches/matches.module';
import { DocumentsModule } from 'src/documents/documents.module';
import { VendorsModule } from 'src/vendors/vendors.module';
import { ProjectsModule } from 'src/projects/projects.module'; // Needed for project data
import { ClientsModule } from 'src/clients/clients.module';

@Module({
  imports: [
    MatchesModule,
    DocumentsModule,
    VendorsModule,
    ProjectsModule, // Import ProjectsModule as AnalyticsService needs project data
    ClientsModule,
  ],
  providers: [AnalyticsService],
  controllers: [AnalyticsController],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
