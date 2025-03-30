import { Injectable } from '@nestjs/common';
import { Release } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { EntityNotFoundException } from 'src/exceptions/entity-not-found.exception';
import { NoDataProvidedException } from 'src/exceptions/no-data.exception';
import { ReleaseTypesService } from 'src/release-types/release-types.service';
import { CreateReleaseDto } from './dto/create-release.dto';
import { UpdateReleaseDto } from './dto/update-release.dto';

@Injectable()
export class ReleasesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly releaseTypesService: ReleaseTypesService,
  ) {}

  async create(createReleaseDto: CreateReleaseDto): Promise<Release> {
    await this.releaseTypesService.findOne(createReleaseDto.releaseTypeId);
    return this.prisma.release.create({
      data: createReleaseDto,
    });
  }

  async findAll(): Promise<Release[]> {
    return this.prisma.release.findMany();
  }

  async findOne(id: string): Promise<Release> {
    const existingRelease = await this.prisma.release.findUnique({
      where: { id },
    });

    if (!existingRelease) {
      throw new EntityNotFoundException('Релиз', 'id', `${id}`);
    }

    return existingRelease;
  }

  async update(
    id: string,
    updateReleaseDto: UpdateReleaseDto,
  ): Promise<Release> {
    if (!updateReleaseDto || Object.keys(updateReleaseDto).length === 0) {
      throw new NoDataProvidedException();
    }

    if (updateReleaseDto.releaseTypeId) {
      await this.releaseTypesService.findOne(updateReleaseDto.releaseTypeId);
    }

    return this.prisma.release.update({
      where: { id },
      data: updateReleaseDto,
    });
  }

  async remove(id: string): Promise<Release> {
    await this.findOne(id);
    return this.prisma.release.delete({
      where: { id },
    });
  }
}
