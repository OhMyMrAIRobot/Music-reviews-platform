import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthorsModule } from 'src/authors/authors.module';
import { NominationTypesModule } from 'src/nomination-types/nomination-types.module';
import { ReleasesModule } from 'src/releases/releases.module';
import { NominationsController } from './nominations.controller';
import { NominationsService } from './nominations.service';

@Module({
  imports: [PrismaModule, NominationTypesModule, ReleasesModule, AuthorsModule],
  controllers: [NominationsController],
  providers: [NominationsService],
  exports: [NominationsService],
})
export class NominationsModule {}
