import { Injectable } from '@nestjs/common';
import { ReleaseProducer } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { AuthorsService } from 'src/authors/authors.service';
import { DuplicateFieldException } from 'src/exceptions/duplicate-field.exception';
import { EntityNotFoundException } from 'src/exceptions/entity-not-found.exception';
import { ReleasesService } from 'src/releases/releases.service';
import { CreateReleaseProducerDto } from './dto/create-release-producer.dto';
import { DeleteReleaseProducerDto } from './dto/delete-release-producer.dto';

@Injectable()
export class ReleaseProducersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authorsService: AuthorsService,
    private readonly releasesService: ReleasesService,
  ) {}

  async create(
    createReleaseProducerDto: CreateReleaseProducerDto,
  ): Promise<ReleaseProducer> {
    const { releaseId, authorId } = createReleaseProducerDto;
    await this.releasesService.findOne(releaseId);
    await this.authorsService.findOne(authorId);

    const existing = await this.findOne(releaseId, authorId);

    if (existing) {
      throw new DuplicateFieldException(
        `Продюсер с id '${authorId}' и`,
        'id релиза',
        `${releaseId}`,
      );
    }

    return this.prisma.releaseProducer.create({
      data: createReleaseProducerDto,
    });
  }

  async findAll(): Promise<ReleaseProducer[]> {
    return this.prisma.releaseProducer.findMany();
  }

  async findByReleaseId(releaseId: string): Promise<ReleaseProducer[]> {
    const result = await this.prisma.releaseProducer.findMany({
      where: { releaseId },
    });

    if (result.length === 0) {
      throw new EntityNotFoundException(
        'Продюсеры',
        'id релиза',
        `${releaseId}`,
      );
    }

    return result;
  }

  async findByAuthorId(authorId: string): Promise<ReleaseProducer[]> {
    const result = await this.prisma.releaseProducer.findMany({
      where: { authorId },
    });

    if (result.length === 0) {
      throw new EntityNotFoundException(
        'Релизы',
        'id продюссера',
        `${authorId}`,
      );
    }

    return result;
  }

  async remove(
    deleteReleaseProducerDto: DeleteReleaseProducerDto,
  ): Promise<ReleaseProducer> {
    const { releaseId, authorId } = deleteReleaseProducerDto;
    const existing = await this.findOne(releaseId, authorId);

    if (!existing) {
      throw new EntityNotFoundException(
        `Продюсер с id '${authorId}' и`,
        'id релиза',
        `${releaseId}`,
      );
    }
    return this.prisma.releaseProducer.delete({
      where: { releaseId_authorId: deleteReleaseProducerDto },
    });
  }

  private async findOne(
    releaseId: string,
    authorId: string,
  ): Promise<ReleaseProducer | null> {
    return this.prisma.releaseProducer.findUnique({
      where: { releaseId_authorId: { releaseId, authorId } },
    });
  }
}
