import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AuthorsModule } from 'src/authors/authors.module';
import { ReleasesModule } from 'src/releases/releases.module';
import { ReleaseProducersController } from './release-producers.controller';
import { ReleaseProducersService } from './release-producers.service';

@Module({
  imports: [AuthorsModule, ReleasesModule],
  controllers: [ReleaseProducersController],
  providers: [ReleaseProducersService, PrismaService],
  exports: [ReleaseProducersService],
})
export class ReleaseProducersModule {}
