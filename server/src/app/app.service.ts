import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { PlatformStatsResponseDto } from './dto/response/platform-stats.response.dto';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async getPlatformStats(): Promise<PlatformStatsResponseDto> {
    const rawQuery = `select * from platform_counters_summary`;
    const [stats] =
      await this.prisma.$queryRawUnsafe<PlatformStatsResponseDto[]>(rawQuery);

    return stats;
  }
}
