import { Injectable } from '@nestjs/common';
import { ReleaseType } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { DuplicateFieldException } from 'src/exceptions/duplicate-field.exception';
import { EntityInUseException } from 'src/exceptions/entity-in-use.exception';
import { EntityNotFoundException } from 'src/exceptions/entity-not-found.exception';
import { NoDataProvidedException } from 'src/exceptions/no-data.exception';
import { CreateReleaseTypeDto } from './dto/create-release-type.dto';
import { UpdateReleaseTypeDto } from './dto/update-release-type.dto';

@Injectable()
export class ReleaseTypesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createReleaseTypeDto: CreateReleaseTypeDto,
  ): Promise<ReleaseType> {
    const { type } = createReleaseTypeDto;
    const existingType = await this.findByType(type);

    if (existingType) {
      throw new DuplicateFieldException('Тип релиза', 'названием', `${type}`);
    }

    return this.prisma.releaseType.create({
      data: createReleaseTypeDto,
    });
  }

  async findAll(): Promise<ReleaseType[]> {
    return this.prisma.releaseType.findMany();
  }

  async findOne(id: string): Promise<ReleaseType> {
    const existingType = await this.prisma.releaseType.findUnique({
      where: { id },
    });

    if (!existingType) {
      throw new EntityNotFoundException('Тип релиза', 'id', `${id}`);
    }

    return existingType;
  }

  async update(
    id: string,
    updateReleaseTypeDto: UpdateReleaseTypeDto,
  ): Promise<ReleaseType> {
    if (
      !updateReleaseTypeDto ||
      Object.keys(updateReleaseTypeDto).length === 0
    ) {
      throw new NoDataProvidedException();
    }

    await this.findOne(id);

    const { type } = updateReleaseTypeDto;
    if (type) {
      const existingType = await this.findByType(type);
      if (existingType) {
        throw new DuplicateFieldException(
          'Тип релиза',
          'названием',
          `${existingType.type}`,
        );
      }
    }

    return this.prisma.releaseType.update({
      where: { id },
      data: updateReleaseTypeDto,
    });
  }

  async remove(id: string): Promise<ReleaseType> {
    await this.findOne(id);

    const releasesWithType = await this.prisma.release.count({
      where: { releaseTypeId: id },
    });

    if (releasesWithType != 0) {
      throw new EntityInUseException('Тип релиза', 'id', `${id}`);
    }

    return this.prisma.releaseType.delete({
      where: { id },
    });
  }

  private async findByType(type: string): Promise<ReleaseType | null> {
    return this.prisma.releaseType.findFirst({
      where: { type: { equals: type, mode: 'insensitive' } },
    });
  }
}
