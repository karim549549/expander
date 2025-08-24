import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from 'src/matches/entities/match.entity';
import { CreateMatchDto } from 'src/matches/dto/create-match.dto';
import { UpdateMatchDto } from 'src/matches/dto/update-match.dto';
import { ProjectsService } from 'src/projects/projects.service'; // Import ProjectsService
import { VendorsService } from 'src/vendors/vendors.service'; // Import VendorsService
import { EmailService } from 'src/email/email.service'; // New import
import { ROLES } from 'src/libs/types/user.type';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
    private readonly projectsService: ProjectsService,
    private readonly vendorsService: VendorsService,
    private readonly emailService: EmailService, // Inject EmailService
  ) {}

  async create(createMatchDto: CreateMatchDto): Promise<Match> {
    const match = this.matchRepository.create(createMatchDto);
    return this.matchRepository.save(match);
  }

  async findAll(): Promise<Match[]> {
    return this.matchRepository.find({ relations: ['project', 'vendor'] });
  }

  async findOne(id: string): Promise<Match> {
    const match = await this.matchRepository.findOne({
      where: { id },
      relations: ['project', 'vendor'],
    });
    if (!match) {
      throw new NotFoundException(`Match with ID ${id} not found`);
    }
    return match;
  }

  async update(id: string, updateMatchDto: UpdateMatchDto): Promise<Match> {
    const match = await this.findOne(id);
    Object.assign(match, updateMatchDto);
    return this.matchRepository.save(match);
  }

  async remove(id: string): Promise<void> {
    const result = await this.matchRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Match with ID ${id} not found`);
    }
  }

  /**
   * Generates and stores vendor matches for a specific project.
   * Implements idempotent upsert logic.
   */
  async rebuildMatchesForProject(projectId: string): Promise<Match[]> {
    // In a real system, this would be a dedicated system user or a user with appropriate privileges
    // For now, we create a mock admin user to satisfy the type requirements of findOne.
    const systemUser: User = {
      id: 'system-user-id', // A unique ID for the system user
      email: 'system@expander.com',
      hashPassword: '', // Not needed for authorization checks
      role: ROLES.ADMIN,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const project = await this.projectsService.findOne(projectId, systemUser);
    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    // Fetch all vendors
    const [allVendors] = await this.vendorsService.findAll(1, 1000); // Fetch all vendors (assuming 1000 is a sufficiently large limit)

    const newMatches: Match[] = [];

    for (const vendor of allVendors) {
      // Matching rules:
      // 1. Vendors must cover same country
      const countryOverlap = vendor.countriesSupported.includes(
        project.country,
      );
      if (!countryOverlap) {
        continue;
      }

      // 2. At least one service overlap
      const serviceOverlapCount = vendor.servicesOffered.filter((service) =>
        project.servicesNeeded.includes(service),
      ).length;

      if (serviceOverlapCount === 0) {
        continue;
      }

      // Score formula: services_overlap * 2 + rating + SLA_weight
      // SLA_weight: Higher for lower SLA hours. Let's define a simple inverse relationship.
      // For example, if SLA is 24 hours, weight is 1. If 12 hours, weight is 2.
      // Max SLA is 72 hours (3 days), min is 1 hour.
      const maxSlaHours = 72; // Example max SLA
      const minSlaHours = 1; // Example min SLA
      const slaNormalized =
        (maxSlaHours - vendor.responseSlaHours) / (maxSlaHours - minSlaHours);
      const slaWeight = Math.max(0, slaNormalized * 5); // Scale to a reasonable weight, e.g., 0-5

      const score = serviceOverlapCount * 2 + vendor.rating + slaWeight;

      // Idempotent upsert logic
      // Check if a match already exists for this project and vendor
      let existingMatch = await this.matchRepository.findOne({
        where: { projectId: project.id, vendorId: vendor.id },
      });

      if (existingMatch) {
        // Update existing match
        existingMatch.score = score;
        await this.matchRepository.save(existingMatch);
        newMatches.push(existingMatch);
        // Send notification for updated match
        await this.emailService.sendMatchNotification(
          project.client.contactEmail, // Assuming project.client is loaded
          project.id, // Project ID
          vendor.name,
          score,
        );
      } else {
        // Create new match
        const newMatch = this.matchRepository.create({
          projectId: project.id,
          vendorId: vendor.id,
          score: score,
        });
        await this.matchRepository.save(newMatch);
        newMatches.push(newMatch);
        // Send notification for new match
        await this.emailService.sendMatchNotification(
          project.client.contactEmail, // Assuming project.client is loaded
          project.id, // Project ID
          vendor.name,
          score,
        );
      }
    }

    return newMatches;
  }
}
