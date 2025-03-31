import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AuthorsModule } from 'src/authors/authors.module';
import { ReleasesModule } from 'src/releases/releases.module';
import { ReleaseDesignersController } from './release-designers.controller';
import { ReleaseDesignersService } from './release-designers.service';

@Module({
  imports: [ReleasesModule, AuthorsModule],
  controllers: [ReleaseDesignersController],
  providers: [ReleaseDesignersService, PrismaService],
  exports: [ReleaseDesignersService],
})
export class ReleaseDesignersModule {}
