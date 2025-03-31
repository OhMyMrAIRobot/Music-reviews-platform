import { Injectable } from '@nestjs/common';
import { ReleaseDesigner } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { AuthorsService } from 'src/authors/authors.service';
import { DuplicateFieldException } from 'src/exceptions/duplicate-field.exception';
import { EntityNotFoundException } from 'src/exceptions/entity-not-found.exception';
import { ReleasesService } from 'src/releases/releases.service';
import { CreateReleaseDesignerDto } from './dto/create-release-designer.dto';
import { DeleteReleaseDesignerDto } from './dto/delete-release-designer.dto';

@Injectable()
export class ReleaseDesignersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authorsService: AuthorsService,
    private readonly releasesService: ReleasesService,
  ) {}

  async create(
    createReleaseDesignerDto: CreateReleaseDesignerDto,
  ): Promise<ReleaseDesigner> {
    const { releaseId, authorId } = createReleaseDesignerDto;
    await this.releasesService.findOne(releaseId);
    await this.authorsService.findOne(authorId);

    const existing = await this.findOne(releaseId, authorId);

    if (existing) {
      throw new DuplicateFieldException(
        `Дизайнер с id '${authorId}' и`,
        'id релиза',
        `${releaseId}`,
      );
    }
    return this.prisma.releaseDesigner.create({
      data: createReleaseDesignerDto,
    });
  }

  async findAll(): Promise<ReleaseDesigner[]> {
    return this.prisma.releaseDesigner.findMany();
  }

  async findByReleaseId(releaseId: string): Promise<ReleaseDesigner[]> {
    const result = await this.prisma.releaseDesigner.findMany({
      where: { releaseId },
    });

    if (result.length === 0) {
      throw new EntityNotFoundException(
        'Дизайнер',
        'id релиза',
        `${releaseId}`,
      );
    }

    return result;
  }

  async findByAuthorId(authorId: string): Promise<ReleaseDesigner[]> {
    const result = await this.prisma.releaseDesigner.findMany({
      where: { authorId },
    });

    if (result.length === 0) {
      throw new EntityNotFoundException('Релиз', 'id дизайнера', `${authorId}`);
    }

    return result;
  }

  async remove(
    deleteReleaseDesignerDto: DeleteReleaseDesignerDto,
  ): Promise<ReleaseDesigner> {
    const { releaseId, authorId } = deleteReleaseDesignerDto;
    const existing = await this.findOne(releaseId, authorId);

    if (!existing) {
      throw new EntityNotFoundException(
        `Дизайнер с id '${authorId}' и`,
        'id релиза',
        `${releaseId}`,
      );
    }

    return this.prisma.releaseDesigner.delete({
      where: { releaseId_authorId: deleteReleaseDesignerDto },
    });
  }

  private async findOne(
    releaseId: string,
    authorId: string,
  ): Promise<ReleaseDesigner | null> {
    return this.prisma.releaseDesigner.findUnique({
      where: { releaseId_authorId: { releaseId, authorId } },
    });
  }
}
