import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { ReleasesModule } from 'src/releases/releases.module';
import { UsersModule } from 'src/users/users.module';
import { RegisteredAuthorsController } from './registered-authors.controller';
import { RegisteredAuthorsService } from './registered-authors.service';

@Module({
  imports: [PrismaModule, UsersModule, ReleasesModule],
  controllers: [RegisteredAuthorsController],
  providers: [RegisteredAuthorsService],
  exports: [RegisteredAuthorsService],
})
export class RegisteredAuthorsModule {}
