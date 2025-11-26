import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { PlatformStatsResponseDto } from './dto/response/platform-stats.response.dto';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieve aggregated platform statistics.
   *
   * This method executes a lightweight raw SQL query against a database view
   * or materialized summary (`platform_counters_summary`) that returns a
   * single-row payload containing platform-wide counters. The method returns
   * the first row deserialized as `PlatformStatsResponseDto`.
   *
   */
  async getPlatformStats(): Promise<PlatformStatsResponseDto> {
    const rawQuery = `select * from platform_counters_summary`;
    const [stats] =
      await this.prisma.$queryRawUnsafe<PlatformStatsResponseDto[]>(rawQuery);

    return stats;
  }
}
