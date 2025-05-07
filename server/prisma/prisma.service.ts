import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
    try {
      await this.$executeRaw`SELECT refresh_top_users()`;
      console.log('Leaderboard initialized successfully');
    } catch (error) {
      console.error('Failed to initialize leaderboard:', error);
    }
  }
}
