import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { ReleasesService } from 'src/releases/releases.service';
import { EntityNotFoundException } from 'src/shared/exceptions/entity-not-found.exception';
import { toDecimal } from 'src/shared/utils/to-decimal';
import { FindAlbumValuesQuery } from './dto/request/query/find-album-values.query.dto';
import { AlbumValueResponseDto } from './dto/response/album-value.response.dto';
import { FindAlbumValuesResponseDto } from './dto/response/find-album-values.response.dto';
import { ALBUM_VALUE_TIER_RANGES } from './types/album-values-tier.type';

@Injectable()
export class AlbumValuesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly releasesService: ReleasesService,
  ) {}

  async findOne(releaseId: string): Promise<AlbumValueResponseDto> {
    await this.releasesService.findOne(releaseId);
    const rawQuery = `
		${this.baseQuery}
		WHERE r.id = '${releaseId}'
		`;

    const data =
      await this.prisma.$queryRawUnsafe<AlbumValueResponseDto[]>(rawQuery);
    if (data.length === 0) {
      throw new EntityNotFoundException(
        'Оценка ценности альбома для релиза',
        'id',
        releaseId,
      );
    } else {
      return data[0];
    }
  }

  async findAll(
    query: FindAlbumValuesQuery,
  ): Promise<FindAlbumValuesResponseDto> {
    const { limit, offset = 0, order, tiers } = query;

    const filters: string[] = [];

    if (tiers && tiers.length > 0) {
      const orClauses = tiers
        .map((t) => {
          const range = ALBUM_VALUE_TIER_RANGES[t];
          if (!range) return null;
          return `(av.value_avg >= ${range.min} AND av.value_avg <= ${range.max})`;
        })
        .filter((x): x is string => Boolean(x));
      if (orClauses.length > 0) {
        filters.push(`(${orClauses.join(' OR ')})`);
      }
    }

    const whereSql = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';

    const rawQuery = `
			${this.baseQuery}
			${whereSql}
			ORDER BY ${
        order !== undefined
          ? `${order === 'asc' ? `av.value_avg ASC` : `av.value_avg DESC`}`
          : 'av.updated_at DESC'
      }
			${limit !== undefined ? `LIMIT ${limit}` : ''}
			OFFSET ${offset}
		`;

    const andParts: Prisma.AlbumValueAggregateWhereInput[] = [];

    if (tiers && tiers.length > 0) {
      const orRanges = tiers
        .map((t) => {
          const range = ALBUM_VALUE_TIER_RANGES[t];
          if (!range) return null;
          return {
            valueAvg: {
              gte: toDecimal(range.min),
              lte: toDecimal(range.max),
            },
          } as Prisma.AlbumValueAggregateWhereInput;
        })
        .filter((x): x is Prisma.AlbumValueAggregateWhereInput => Boolean(x));

      if (orRanges.length > 0) {
        andParts.push({ OR: orRanges });
      }
    }

    const where: Prisma.AlbumValueAggregateWhereInput =
      andParts.length > 0 ? { AND: andParts } : {};

    const [count, values] = await Promise.all([
      this.prisma.albumValueAggregate.count({ where }),
      this.prisma.$queryRawUnsafe<AlbumValueResponseDto[]>(rawQuery),
    ]);

    return { count, values };
  }

  private baseQuery = `
	SELECT
			jsonb_build_object(
							'total', av.rarity_avg,
							'rarityGenre', av.rarity_genre_avg,
							'rarityPerformance', av.rarity_performance_avg
			) AS rarity,
			jsonb_build_object(
							'total', av.integrity_avg,
							'integrityGenre', av.integrity_genre_avg,
							'integritySemantic', av.integrity_semantic_avg,
							'formatRelease', av.format_release_score_avg
			) AS integrity,
			to_jsonb(av.depth_avg) AS "depth",
			jsonb_build_object(
							'rhymes', av.quality_rhymes_images_avg,
							'structure', av.quality_structure_rhythm_avg,
							'styleImplementation', av.quality_style_impl_avg,
							'individuality', av.quality_individuality_avg,
							'factor', av.quality_factor_avg,
							'total', av.quality_points_avg
			) AS quality,
			jsonb_build_object(
							'authorPopularity', av.influence_author_popularity_avg,
							'releaseAnticip', av.influence_release_anticip_avg,
							'multiplier', av.influence_multiplier_avg,
							'total', av.influence_points_avg
			) AS influence,
			to_jsonb(av.value_avg) AS "totalValue",
			jsonb_build_object(
							'id', r.id,
							'img', r.img,
							'title', r.title,
							'authors', au.authors
			) AS "release"
	FROM "Album_value_aggregate" av
			JOIN "Releases" r ON av.release_id = r.id
			LEFT JOIN LATERAL (
					SELECT
							COALESCE(
									jsonb_agg(
											jsonb_build_object(
													'id', a.id,
													'name', a.name
											)
											ORDER BY a.name
									),
									'[]'::jsonb
					) AS authors
			FROM "Release_artists" ra
					LEFT JOIN "Authors" a ON a.id = ra.author_id
			WHERE ra.release_id = r.id
			) au ON TRUE
	`;
}
