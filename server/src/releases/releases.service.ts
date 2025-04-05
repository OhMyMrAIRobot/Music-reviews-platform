import { Injectable } from '@nestjs/common';
import { Release } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { EntityNotFoundException } from 'src/exceptions/entity-not-found.exception';
import { NoDataProvidedException } from 'src/exceptions/no-data.exception';
import { ReleaseTypesService } from 'src/release-types/release-types.service';
import { CreateReleaseDto } from './dto/create-release.dto';
import { TopReleasesResponseDto } from './dto/top-releases.response.dto';
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

  async findMostCommentedReleasesLastDay(): Promise<TopReleasesResponseDto> {
    const topReleases = await this.prisma.$queryRaw<TopReleasesResponseDto>`
      SELECT r.id, r.title, r.img,
        rt.type as release_type,
        count(DISTINCT rev.id)::int AS review_count,
        json_agg(DISTINCT jsonb_build_object('name', a.name)) AS author,
        json_agg(DISTINCT jsonb_build_object(
          'total', rr.total,
          'type', rrt.type
        )) as ratings
      FROM "Releases" r
      LEFT JOIN "Release_artists" ra ON r.id = ra.release_id
      LEFT JOIN "Authors" a ON ra.author_id = a.id
      LEFT JOIN "Reviews" rev on rev.release_id = r.id
        AND rev.created_at >= NOW() - INTERVAL '24 hours'
      LEFT JOIN "Release_types" rt on r.release_type_id = rt.id
      LEFT JOIN "Release_ratings" rr on r.id = rr.release_id
      LEFT JOIN "Release_rating_types" rrt on rr.release_rating_type_id = rrt.id
      GROUP BY r.id, rt.type
      ORDER BY COUNT(rev.id) DESC
      LIMIT 15`;

    return topReleases;
  }
}
