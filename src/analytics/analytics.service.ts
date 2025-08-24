import { Injectable } from '@nestjs/common';
import { MatchesService } from 'src/matches/matches.service';
import { DocumentsService } from 'src/documents/documents.service';
import { VendorsService } from 'src/vendors/vendors.service';
import { ProjectsService } from 'src/projects/projects.service';
import { ClientsService } from 'src/clients/clients.service'; // New import
import {
  CountryAnalytics,
  ClientActivity,
  MostActiveProject,
} from 'src/libs/types/analytics.type'; // Updated import

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly matchesService: MatchesService,
    private readonly documentsService: DocumentsService,
    private readonly vendorsService: VendorsService,
    private readonly projectsService: ProjectsService,
    private readonly clientsService: ClientsService, // Inject ClientsService
  ) {}

  async getTopVendorsPerCountry(): Promise<CountryAnalytics[]> {
    const topVendorsData: CountryAnalytics[] = []; // Updated type

    // 1. Get all vendors to iterate through countries
    const [allVendors] = await this.vendorsService.findAll(1, 1000); // Fetch all vendors (assuming 1000 is a sufficiently large limit)
    const uniqueCountries = [
      ...new Set(allVendors.flatMap((vendor) => vendor.countriesSupported)),
    ];

    for (const country of uniqueCountries) {
      // 2. Get average match score for top 3 vendors in this country (last 30 days, from MySQL)
      // This requires filtering matches by project country and date
      // For simplicity, let's assume MatchesService can provide this or we query directly
      // For now, we'll fetch all matches and filter in memory (not efficient for large datasets)
      const allMatches = await this.matchesService.findAll(); // This fetches all matches

      const countryMatches = allMatches.filter((match) => {
        // Assuming project has a country property and createdAt
        // Need to fetch project details for each match or eager load
        // For now, let's assume match.project.country is available
        const matchDate = new Date(match.createdAt);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return match.project.country === country && matchDate >= thirtyDaysAgo;
      });

      // Group by vendor and calculate average score
      const vendorScores: {
        [vendorId: string]: {
          totalScore: number;
          count: number;
          vendorName: string;
        };
      } = {};
      for (const match of countryMatches) {
        if (!vendorScores[match.vendor.id]) {
          vendorScores[match.vendor.id] = {
            totalScore: 0,
            count: 0,
            vendorName: match.vendor.name,
          };
        }
        vendorScores[match.vendor.id].totalScore += match.score;
        vendorScores[match.vendor.id].count++;
      }

      const sortedVendors = Object.entries(vendorScores)
        .map(([vendorId, data]) => ({
          vendorId,
          vendorName: data.vendorName,
          averageScore: data.totalScore / data.count,
        }))
        .sort((a, b) => b.averageScore - a.averageScore)
        .slice(0, 3); // Top 3

      // 3. Count research documents linked to expansion projects in that country (from MongoDB)
      const projectsInCountry =
        await this.projectsService.findProjectsByCountry(country);
      let researchDocumentsCount = 0;
      for (const project of projectsInCountry) {
        const docs = await this.documentsService.findByProject(project.id);
        researchDocumentsCount += docs.length;
      }

      topVendorsData.push({
        country,
        topVendors: sortedVendors,
        researchDocumentsCount,
      });
    }

    return topVendorsData;
  }
}
