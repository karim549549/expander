import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';
import { Match } from './entities/match.entity';
import { ProjectsModule } from 'src/projects/projects.module';
import { VendorsModule } from 'src/vendors/vendors.module';
import { EmailModule } from 'src/email/email.module'; // New import

@Module({
  imports: [
    TypeOrmModule.forFeature([Match]),
    ProjectsModule,
    VendorsModule,
    EmailModule, // Add EmailModule
  ],
  controllers: [MatchesController],
  providers: [MatchesService],
  exports: [MatchesService],
})
export class MatchesModule {}