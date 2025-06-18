import { Injectable } from '@nestjs/common';
import { ReleaseRatingType } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { DuplicateFieldException } from 'src/exceptions/duplicate-field.exception';
import { EntityNotFoundException } from 'src/exceptions/entity-not-found.exception';
import { NoDataProvidedException } from 'src/exceptions/no-data.exception';
import { CreateReleaseRatingTypeDto } from './dto/create-release-rating-type.dto';
import { UpdateReleaseRatingTypeDto } from './dto/update-release-rating-type.dto';

@Injectable()
export class ReleaseRatingTypesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createReleaseRatingTypeDto: CreateReleaseRatingTypeDto,
  ): Promise<ReleaseRatingType> {
    const { type } = createReleaseRatingTypeDto;
    const existing = await this.findByType(type);

    if (existing) {
      throw new DuplicateFieldException(
        'Тип рейтинга релизоа',
        'названием',
        `${type}`,
      );
    }

    return this.prisma.releaseRatingType.create({
      data: createReleaseRatingTypeDto,
    });
  }

  async findAll(): Promise<ReleaseRatingType[]> {
    return this.prisma.releaseRatingType.findMany();
  }

  async findOne(id: string): Promise<ReleaseRatingType> {
    const existing = await this.prisma.releaseRatingType.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new EntityNotFoundException('Тип рейтинга релизоа', 'id', `${id}`);
    }

    return existing;
  }

  async update(
    id: string,
    updateReleaseRatingTypeDto: UpdateReleaseRatingTypeDto,
  ): Promise<ReleaseRatingType> {
    if (
      !updateReleaseRatingTypeDto ||
      Object.keys(updateReleaseRatingTypeDto).length === 0
    ) {
      throw new NoDataProvidedException();
    }

    await this.findOne(id);

    const { type } = updateReleaseRatingTypeDto;
    if (type) {
      const existing = await this.findByType(type);
      if (existing) {
        throw new DuplicateFieldException(
          'Тип рейтинга релизоа',
          'названием',
          `${type}`,
        );
      }
    }

    return this.prisma.releaseRatingType.update({
      where: { id },
      data: updateReleaseRatingTypeDto,
    });
  }

  async remove(id: string): Promise<ReleaseRatingType> {
    await this.findOne(id);
    return this.prisma.releaseRatingType.delete({
      where: { id },
    });
  }

  async findByType(type: string): Promise<ReleaseRatingType | null> {
    return this.prisma.releaseRatingType.findFirst({
      where: { type: { equals: type, mode: 'insensitive' } },
    });
  }
}
