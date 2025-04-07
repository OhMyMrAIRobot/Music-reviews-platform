import { Injectable } from '@nestjs/common';
import { Release } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { EntityNotFoundException } from 'src/exceptions/entity-not-found.exception';
import { NoDataProvidedException } from 'src/exceptions/no-data.exception';
import { ReleaseTypesService } from 'src/release-types/release-types.service';
import { CreateReleaseDto } from './dto/create-release.dto';
import { ReleaseDetailResponseDto } from './dto/release-detail.response.dto';
import { ReleaseResponseDto } from './dto/release.response.dto';
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

  async findMostCommentedReleasesLastDay(): Promise<ReleaseResponseDto[]> {
    return this.prisma.$queryRaw<ReleaseResponseDto[]>`
      SELECT r.id, r.title, r.img,
        rt.type as release_type,
        (count(DISTINCT rev.id) FILTER (WHERE rev.text IS NOT NULL))::int AS text_count,
        (count(DISTINCT rev.id) FILTER (WHERE rev.text IS NULL))::int AS no_text_count,
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
  }

  async findReleaseDetails(
    releaseId: string,
  ): Promise<ReleaseDetailResponseDto> {
    const rawQuery = `
        SELECT
          r.id,
          r.title,
          EXTRACT(YEAR FROM r.publish_date) AS year,
          r.img AS release_img,
          rt.type as release_type,
          (
            SELECT JSON_AGG(DISTINCT JSONB_BUILD_OBJECT(
              'name', a.name,
              'img', a.avatar_img
            ))
            FROM "Release_artists" ra
            JOIN "Authors" a on ra.author_id = a.id
            WHERE ra.release_id = r.id
          ) AS artists,
          (
            SELECT JSON_AGG(DISTINCT JSONB_BUILD_OBJECT(
              'name', a.name,
              'img', a.avatar_img
            ))
            FROM "Release_producers" rp
            JOIN "Authors" a on rp.author_id = a.id
            WHERE rp.release_id = r.id
          ) AS producers,
          (
            SELECT JSON_AGG(DISTINCT JSONB_BUILD_OBJECT(
              'name', a.name,
              'img', a.avatar_img
            ))
            FROM "Release_designers" rd
            JOIN "Authors" a on rd.author_id = a.id
            WHERE rd.release_id = r.id
          ) AS designers,
          COUNT(DISTINCT ufr.user_id)::int AS likes_count,
          JSON_AGG(DISTINCT JSONB_BUILD_OBJECT('user_id', ufr.user_id)) AS user_like_ids,
          JSON_AGG(DISTINCT JSONB_BUILD_OBJECT(
              'type', rrt.type,
              'total', rr.total
          )) AS ratings,
          JSON_AGG(DISTINCT  JSONB_BUILD_OBJECT(
              'type', rrt.type,
              'details', rrd
          )) AS rating_details
        FROM "Releases" r
        LEFT JOIN "Release_types" rt on r.release_type_id = rt.id
        LEFT JOIN "User_fav_releases" ufr on r.id = ufr.release_id
        LEFT JOIN "Release_ratings" rr on r.id = rr.release_id
        LEFT JOIN "Release_rating_types" rrt on rr.release_rating_type_id = rrt.id
        LEFT JOIN "Release_rating_details" rrd on rr.id = rrd.release_rating_id
        WHERE r.id = '${releaseId}'
        GROUP BY r.id, rt.type`;

    return this.prisma.$queryRawUnsafe<ReleaseDetailResponseDto>(rawQuery);
  }

  async findReleases(
    field: string = 'r.publish_date',
    order: 'asc' | 'desc' = 'desc',
    limit: number = 25,
    offset: number = 0,
  ): Promise<ReleaseResponseDto[]> {
    const allowedFields = ['r.publish_date', 'r.title', 'r.id'];
    const allowedOrders = ['asc', 'desc'];

    if (!allowedFields.includes(field.toLowerCase())) field = 'r.published_at';
    if (!allowedOrders.includes(order.toLowerCase())) order = 'desc';

    const rawQuery = `
      SELECT r.id, r.title, r.img,
        rt.type AS release_type,
        (count(DISTINCT rev.id) FILTER (WHERE rev.text IS NOT NULL))::int AS text_count,
        (count(DISTINCT rev.id) FILTER (WHERE rev.text IS NULL))::int AS no_text_count,
        json_agg(DISTINCT jsonb_build_object('name', a.name)) as author,
        json_agg(DISTINCT jsonb_build_object(
          'total', rr.total,
          'type', rrt.type
        )) as ratings
      FROM "Releases" r
      LEFT JOIN "Release_types" rt on r.release_type_id = rt.id
      LEFT JOIN "Release_artists" ra on r.id = ra.release_id
      LEFT JOIN "Authors" a on ra.author_id = a.id
      LEFT JOIN "Reviews" rev on rev.release_id = r.id
      LEFT JOIN "Release_ratings" rr on rr.release_id = r.id
      LEFT JOIN "Release_rating_types" rrt on rr.release_rating_type_id = rrt.id
      GROUP BY r.id, rt.type
      ORDER BY ${field} ${order}
      LIMIT ${limit}
      OFFSET ${offset};
    `;

    return this.prisma.$queryRawUnsafe<ReleaseResponseDto[]>(rawQuery);
  }
}
