import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { StandardResponse } from 'src/common/responses/standard-response';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ROLES } from 'src/libs/types/user.type';
import { CountryAnalytics } from 'src/libs/types/analytics.type';

@ApiTags('analytics')
@Controller('analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('top-vendors')
  @ApiOperation({
    summary:
      'Get top 3 vendors per country with average match score and research document count',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Top vendors analytics retrieved successfully',
    type: StandardResponse,
  })
  @Roles(ROLES.ADMIN)
  async getTopVendors(): Promise<StandardResponse<CountryAnalytics[]>> {
    const data = await this.analyticsService.getTopVendorsPerCountry();
    return new StandardResponse(
      data,
      'Top vendors analytics retrieved successfully',
    );
  }
}
