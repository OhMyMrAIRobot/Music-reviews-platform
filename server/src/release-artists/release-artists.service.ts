import { Injectable } from '@nestjs/common';
import { ReleaseArtist } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { AuthorsService } from 'src/authors/authors.service';
import { DuplicateFieldException } from 'src/exceptions/duplicate-field.exception';
import { EntityNotFoundException } from 'src/exceptions/entity-not-found.exception';
import { ReleasesService } from 'src/releases/releases.service';
import { CreateReleaseArtistDto } from './dto/create-release-artist.dto';
import { DeleteReleaseArtistDto } from './dto/delete-release-artist.dto';

@Injectable()
export class ReleaseArtistsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authorsService: AuthorsService,
    private readonly releasesService: ReleasesService,
  ) {}

  async create(
    createReleaseArtistDto: CreateReleaseArtistDto,
  ): Promise<ReleaseArtist> {
    const { releaseId, authorId } = createReleaseArtistDto;
    await this.releasesService.findOne(releaseId);
    await this.authorsService.findOne(authorId);

    const existing = await this.findOne(releaseId, authorId);

    if (existing) {
      throw new DuplicateFieldException(
        `Артист с id '${authorId}' и`,
        'id релиза',
        `${releaseId}`,
      );
    }
    return this.prisma.releaseArtist.create({
      data: createReleaseArtistDto,
    });
  }

  async findAll(): Promise<ReleaseArtist[]> {
    return this.prisma.releaseArtist.findMany();
  }

  async findByReleaseId(releaseId: string): Promise<ReleaseArtist[]> {
    const result = await this.prisma.releaseArtist.findMany({
      where: { releaseId },
    });

    if (result.length === 0) {
      throw new EntityNotFoundException('Артист', 'id релиза', `${releaseId}`);
    }

    return result;
  }

  async findByAuthorId(authorId: string): Promise<ReleaseArtist[]> {
    const result = await this.prisma.releaseArtist.findMany({
      where: { authorId },
    });

    if (result.length === 0) {
      throw new EntityNotFoundException('Релиз', 'id артиса', `${authorId}`);
    }

    return result;
  }

  async remove(
    deleteReleaseArtistDto: DeleteReleaseArtistDto,
  ): Promise<ReleaseArtist> {
    const { releaseId, authorId } = deleteReleaseArtistDto;
    const existing = await this.findOne(releaseId, authorId);

    if (!existing) {
      throw new EntityNotFoundException(
        `Артист с id '${authorId}' и`,
        'id релиза',
        `${releaseId}`,
      );
    }
    return this.prisma.releaseArtist.delete({
      where: { releaseId_authorId: deleteReleaseArtistDto },
    });
  }

  private async findOne(
    releaseId: string,
    authorId: string,
  ): Promise<ReleaseArtist | null> {
    return this.prisma.releaseArtist.findUnique({
      where: { releaseId_authorId: { releaseId, authorId } },
    });
  }
}
