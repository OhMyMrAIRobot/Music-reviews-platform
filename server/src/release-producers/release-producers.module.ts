import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthorsModule } from 'src/authors/authors.module';
import { ReleasesModule } from 'src/releases/releases.module';
import { ReleaseProducersController } from './release-producers.controller';
import { ReleaseProducersService } from './release-producers.service';

@Module({
  imports: [AuthorsModule, ReleasesModule, PrismaModule],
  controllers: [ReleaseProducersController],
  providers: [ReleaseProducersService],
  exports: [ReleaseProducersService],
})
export class ReleaseProducersModule {}
