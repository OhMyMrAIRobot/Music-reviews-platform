import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { LeaderboardQueryDto } from './dto/query/leaderboard.query.dto';
import { LeaderboardItemDto } from './dto/response/leaderboard-item.dto';

@Injectable()
export class LeaderboardService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Load leaderboard items according to the provided query.
   *
   * Implementation details:
   * - Executes a complex raw SQL query that aggregates review counts,
   *   likes (received/given), author-related likes and top likers per user.
   * - The query reads from precomputed leaderboard tables (e.g. the
   *   `Top_users_leaderboard` view) which are refreshed periodically by
   *   the scheduler.
   *
   * @param query Pagination parameters (`limit`, `offset`)
   * @returns Array of `LeaderboardItemDto` with user info and stats
   */
  async getLeaderboard(
    query: LeaderboardQueryDto,
  ): Promise<LeaderboardItemDto[]> {
    const { limit, offset = 0 } = query;

    const sql = Prisma.sql`
      WITH
          params AS (
              SELECT
                  ${limit}::int AS limit_,
                  ${offset}::int AS offset_
          ),

          release_participants AS (
              SELECT release_id, author_id FROM "Release_artists"
              UNION
              SELECT release_id, author_id FROM "Release_producers"
              UNION
              SELECT release_id, author_id FROM "Release_designers"
          ),

          review_counts AS (
              SELECT
                  rev.user_id,
                  COUNT(DISTINCT rev.id) FILTER (WHERE rev.text IS NOT NULL)::int AS text_count,
                  COUNT(DISTINCT rev.id) FILTER (WHERE rev.text IS NULL)::int AS without_text_count
              FROM "Reviews" rev
              GROUP BY rev.user_id
          ),

          received_likes_reviews AS (
              SELECT rev.user_id, COUNT(*)::int AS cnt
              FROM "User_fav_reviews" ufr
                  JOIN "Reviews" rev ON rev.id = ufr.review_id
              GROUP BY rev.user_id
          ),

          received_likes_media AS (
              SELECT rm.user_id, COUNT(*)::int AS cnt
              FROM "User_fav_media" ufm
                  JOIN "Release_media" rm ON rm.id = ufm.media_id
              GROUP BY rm.user_id
          ),

          received_likes_total AS (
              SELECT
                  COALESCE(rr.user_id, rm.user_id) AS user_id,
                  (COALESCE(rr.cnt,0) + COALESCE(rm.cnt,0))::int AS total_received_likes
              FROM received_likes_reviews rr
                  FULL JOIN received_likes_media rm USING (user_id)
          ),

          given_likes_reviews AS (
              SELECT ufr.user_id AS liker_id, COUNT(*)::int AS cnt
              FROM "User_fav_reviews" ufr
                  JOIN "Reviews" rev ON rev.id = ufr.review_id
              WHERE rev.user_id IS DISTINCT FROM ufr.user_id
              GROUP BY ufr.user_id
          ),

          given_likes_media AS (
              SELECT ufm.user_id AS liker_id, COUNT(*)::int AS cnt
              FROM "User_fav_media" ufm
                  JOIN "Release_media" rm ON rm.id = ufm.media_id
              WHERE rm.user_id IS DISTINCT FROM ufm.user_id
              GROUP BY ufm.user_id
          ),

          given_likes_total AS (
              SELECT
                  COALESCE(gr.liker_id, gm.liker_id) AS user_id,
                  (COALESCE(gr.cnt,0) + COALESCE(gm.cnt,0))::int AS total_given_likes
              FROM given_likes_reviews gr
                  FULL JOIN given_likes_media gm USING (liker_id)
          ),

          received_author_likes_reviews AS (
              SELECT rev.user_id AS user_id, COUNT(*)::int AS cnt
              FROM "User_fav_reviews" ufr
                  JOIN "Reviews" rev ON rev.id = ufr.review_id
                  JOIN "Registered_authors" ra ON ra.user_id = ufr.user_id
                  JOIN release_participants rp ON rp.release_id = rev.release_id AND rp.author_id = ra.author_id
              GROUP BY rev.user_id
          ),

          received_author_likes_media AS (
              SELECT rm.user_id AS user_id, COUNT(*)::int AS cnt
              FROM "User_fav_media" ufm
                  JOIN "Release_media" rm ON rm.id = ufm.media_id
                  JOIN "Registered_authors" ra ON ra.user_id = ufm.user_id
                  JOIN release_participants rp ON rp.release_id = rm.release_id AND rp.author_id = ra.author_id
              GROUP BY rm.user_id
          ),

          -- суммарные author likes (rev + media)
          received_author_likes_total AS (
              SELECT
                  COALESCE(rr.user_id, rm.user_id) AS user_id,
                  (COALESCE(rr.cnt,0) + COALESCE(rm.cnt,0))::int AS total_author_likes
              FROM received_author_likes_reviews rr
                  FULL JOIN received_author_likes_media rm USING (user_id)
          ),

          author_liker_raw AS (
              SELECT
                  rev.user_id AS target_user,
                  u2.id            AS liker_id,
                  u2.nickname      AS liker_nickname,
                  up2.avatar       AS liker_avatar,
                  COUNT(*)::int    AS cnt
              FROM "User_fav_reviews" ufr
                  JOIN "Reviews" rev ON rev.id = ufr.review_id
                  JOIN "Users" u2 ON u2.id = ufr.user_id
                  LEFT JOIN "User_profiles" up2 ON up2.user_id = u2.id
                  JOIN "Registered_authors" ra ON ra.user_id = ufr.user_id
                  JOIN release_participants rp ON rp.release_id = rev.release_id AND rp.author_id = ra.author_id
              GROUP BY rev.user_id, u2.id, u2.nickname, up2.avatar

              UNION ALL

              SELECT
                  rm.user_id AS target_user,
                  u3.id            AS liker_id,
                  u3.nickname      AS liker_nickname,
                  up3.avatar       AS liker_avatar,
                  COUNT(*)::int    AS cnt
              FROM "User_fav_media" ufm
                  JOIN "Release_media" rm ON rm.id = ufm.media_id
                  JOIN "Users" u3 ON u3.id = ufm.user_id
                  LEFT JOIN "User_profiles" up3 ON up3.user_id = u3.id
                  JOIN "Registered_authors" ra2 ON ra2.user_id = ufm.user_id
                  JOIN release_participants rp2 ON rp2.release_id = rm.release_id AND rp2.author_id = ra2.author_id
              GROUP BY rm.user_id, u3.id, u3.nickname, up3.avatar
          ),

          author_liker_agg AS (
              SELECT
                  target_user,
                  liker_id,
                  liker_nickname,
                  liker_avatar,
                  SUM(cnt)::int AS total_cnt
              FROM author_liker_raw
              GROUP BY target_user, liker_id, liker_nickname, liker_avatar
          ),

          author_liker_ranked AS (
              SELECT
                  ala.*,
                  ROW_NUMBER() OVER (PARTITION BY target_user ORDER BY total_cnt DESC, liker_id ASC) AS rn
              FROM author_liker_agg ala
          ),

          top_author_likers_json AS (
              SELECT
                  target_user,
                  COALESCE(
                      jsonb_agg(
                          jsonb_build_object(
                              'user', jsonb_build_object(
                                          'id', liker_id,
                                          'avatar', liker_avatar,
                                          'nickname', liker_nickname
                                      ),
                              'count', total_cnt
                          ) ORDER BY total_cnt DESC, liker_id ASC
                      ) FILTER (WHERE rn <= 3),
                      '[]'::jsonb
                  ) AS top_likers
              FROM author_liker_ranked
              WHERE rn <= 3
              GROUP BY target_user
          ),

          main AS (
              SELECT
                  jsonb_build_object(
                          'id', tul.user_id,
                          'nickname', u.nickname,
                          'avatar', up.avatar,
                          'cover', up.cover_image,
                          'points', up.points,
                          'rank', tul.rank
                  ) AS "user",

                  jsonb_build_object(
                          'textCount', COALESCE(rc.text_count, 0),
                          'withoutTextCount', COALESCE(rc.without_text_count, 0),
                          'receivedLikes', COALESCE(rlt.total_received_likes, 0),
                          'givenLikes', COALESCE(glt.total_given_likes, 0),
                          'receivedAuthorLikes', COALESCE(ralt.total_author_likes, 0)
                  )::jsonb AS stats,

                  COALESCE(tal.top_likers, '[]'::jsonb) AS "topAuthorLikers",

                  up.points AS points_order,
                  tul.user_id AS uid_order
              FROM "Top_users_leaderboard" tul
                  JOIN "User_profiles" up ON up.user_id = tul.user_id
                  JOIN "Users" u ON u.id = up.user_id
                  LEFT JOIN review_counts rc ON rc.user_id = tul.user_id
                  LEFT JOIN received_likes_total rlt ON rlt.user_id = tul.user_id
                  LEFT JOIN given_likes_total glt ON glt.user_id = tul.user_id
                  LEFT JOIN received_author_likes_total ralt ON ralt.user_id = tul.user_id
                  LEFT JOIN top_author_likers_json tal ON tal.target_user = tul.user_id
          ),

          paged AS (
              SELECT "user", stats, "topAuthorLikers"
              FROM main
              ORDER BY points_order DESC, uid_order
              LIMIT (SELECT limit_ FROM params)
              OFFSET (SELECT offset_ FROM params)
          )

      SELECT *
      FROM paged;
	`;

    return this.prisma.$queryRaw<LeaderboardItemDto[]>(sql);
  }
}
