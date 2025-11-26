import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { ReleasesService } from 'src/releases/releases.service';
import { EntityNotFoundException } from 'src/shared/exceptions/entity-not-found.exception';
import { SortOrder } from 'src/shared/types/sort-order.type';
import { AlbumValuesQueryDto } from './dto/request/query/album-values.query.dto';
import { AlbumValueDto } from './dto/response/album-value.dto';
import { AlbumValuesResponseDto } from './dto/response/album-values.response.dto';
import {
  AlbumValuesRawQueryArrayDto,
  AlbumValuesRawQueryDto,
} from './types/album-values-raw-query.dto';
import { AlbumValueTier } from './types/album-values-tier.type';

@Injectable()
export class AlbumValuesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly releasesService: ReleasesService,
  ) {}
  /**
   * Find computed album value for a single release.
   *
   * Preconditions:
   * - The release must exist (the call will delegate to `ReleasesService`).
   *
   * Returns the first `AlbumValueDto` matching the `releaseId` or throws
   * `EntityNotFoundException` when no computed value is available.
   */
  async findOne(releaseId: string): Promise<AlbumValueDto> {
    await this.releasesService.findOne(releaseId);

    const { result } = await this.executeRawQuery({ releaseId });

    if (result.items.length === 0) {
      throw new EntityNotFoundException(
        'Ценность альбома',
        'releaseId',
        releaseId,
      );
    }

    return result.items[0];
  }

  /**
   * Query computed album values with optional filtering and pagination.
   *
   * Accepts parameters from `AlbumValuesQueryDto` and returns a paginated
   * `AlbumValuesResponseDto` containing `items` and `meta` information.
   */
  async findAll(query: AlbumValuesQueryDto): Promise<AlbumValuesResponseDto> {
    const { result } = await this.executeRawQuery(query);

    return result;
  }

  /**
   * Execute the internal raw SQL query which computes album value aggregates.
   *
   * This private helper constructs and runs a parameterized Prisma SQL
   * statement that returns a JSON payload shaped as `AlbumValuesResponseDto`.
   * Parameters:
   * - `releaseId` to limit to a single release
   * - `sortOrder` to control ordering
   * - `tiers` to filter by tier slugs
   * - `limit` and `offset` for pagination
   *
   * Returns the raw query wrapper object returned by Prisma.
   */
  private async executeRawQuery(query: {
    releaseId?: string;
    sortOrder?: SortOrder;
    tiers?: AlbumValueTier[];
    limit?: number;
    offset?: number;
  }): Promise<AlbumValuesRawQueryDto> {
    const {
      releaseId = null,
      sortOrder = null,
      tiers = null,
      limit = null,
      offset = null,
    } = query;

    const sql = Prisma.sql`
      WITH params AS (
          SELECT
              ${releaseId}::text AS release_id,
              ${sortOrder}::text AS sort_order,
              ${tiers}::text[] AS tiers,
              ${limit}::int AS limit_,
              ${offset}::int AS offset_
      ),

          filtered_av AS (
              SELECT av.*
              FROM "Album_value_aggregate" av
                  JOIN params p ON TRUE
                  JOIN "Releases" r ON r.id = av.release_id
              WHERE
                  (p.release_id IS NULL OR p.release_id = '' OR av.release_id::text = p.release_id)

                -- tier filters
                AND (
                  p.tiers IS NULL
                      OR array_length(p.tiers, 1) IS NULL
                      OR array_length(p.tiers, 1) = 0
                      OR EXISTS (
                          SELECT 1
                          FROM unnest(p.tiers) AS t(tier)
                          WHERE
                              (tier = 'silver'  AND av.value_avg >= 0 AND av.value_avg <= 5.99)
                              OR (tier = 'gold'    AND av.value_avg >= 6 AND av.value_avg <= 11.99)
                              OR (tier = 'emerald' AND av.value_avg >= 12 AND av.value_avg <= 17.99)
                              OR (tier = 'sapphire'AND av.value_avg >= 18 AND av.value_avg <= 23.99)
                              OR (tier = 'ruby'    AND av.value_avg >= 24 AND av.value_avg <= 30)
                      )
                  )
          ),

          agg_stats AS (
              SELECT COUNT(*)::int AS total_count
              FROM filtered_av
          ),

          page AS (
              SELECT
                  jsonb_build_object(
                          'rarity', jsonb_build_object(
                              'total', av.rarity_avg,
                              'rarityGenre', av.rarity_genre_avg,
                              'rarityPerformance', av.rarity_performance_avg
                          ),

                          'integrity', jsonb_build_object(
                              'total', av.integrity_avg,
                              'integrityGenre', av.integrity_genre_avg,
                              'integritySemantic', av.integrity_semantic_avg,
                              'formatRelease', av.format_release_score_avg
                          ),

                          'quality', jsonb_build_object(
                              'rhymes', av.quality_rhymes_images_avg,
                              'structure', av.quality_structure_rhythm_avg,
                              'styleImplementation', av.quality_style_impl_avg,
                              'individuality', av.quality_individuality_avg,
                              'factor', av.quality_factor_avg,
                              'total', av.quality_points_avg
                          ),

                          'influence', jsonb_build_object(
                              'authorPopularity', av.influence_author_popularity_avg,
                              'releaseAnticip', av.influence_release_anticip_avg,
                              'multiplier', av.influence_multiplier_avg,
                              'total', av.influence_points_avg
                          ),

                          'release', jsonb_build_object(
                              'id', r.id,
                              'img', r.img,
                              'title', r.title,
                              'authors', au.authors
                          ),

                          'depth', to_jsonb(av.depth_avg),
                          'totalValue', to_jsonb(av.value_avg)
                  ) AS item_json,
                  av.value_avg AS sort_by_value,
                  av.updated_at AS sort_by_updated
              FROM filtered_av av
                  JOIN "Releases" r ON r.id = av.release_id
                  LEFT JOIN LATERAL (
                      SELECT
                          COALESCE(
                              jsonb_agg(
                                      jsonb_build_object(
                                                  'id', a.id,
                                                  'name', a.name
                                      ) ORDER BY a.name
                              ),
                              '[]'::jsonb
                          ) AS authors
                  FROM "Release_artists" ra
                      LEFT JOIN "Authors" a ON a.id = ra.author_id
                  WHERE ra.release_id = r.id
                  ) au ON TRUE
                  JOIN params p ON TRUE

              ORDER BY
                  CASE WHEN lower(coalesce(p.sort_order, '')) = 'asc' THEN av.value_avg END ASC NULLS LAST,
                  CASE WHEN lower(coalesce(p.sort_order, '')) = 'desc' THEN av.value_avg END DESC NULLS LAST,
                  av.release_id

              LIMIT (SELECT limit_ FROM params)
              OFFSET (SELECT offset_ FROM params)
          )

      SELECT
          jsonb_build_object(
                  'items', items.items,
                  'meta', jsonb_build_object('count', agg.total_count)
          ) AS result
      FROM (
          SELECT
              COALESCE(
                      JSONB_AGG(page.item_json) FILTER (WHERE page.item_json IS NOT NULL),
                      '[]'::jsonb
              ) AS items
          FROM page
      ) items
      CROSS JOIN agg_stats agg;
    `;

    const [result] =
      await this.prisma.$queryRaw<AlbumValuesRawQueryArrayDto>(sql);

    return result;
  }
}
