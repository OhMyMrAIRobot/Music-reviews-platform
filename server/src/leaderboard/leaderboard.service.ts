import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { LeaderboardItemDto } from './dto/leaderboard-item.dto';

@Injectable()
export class LeaderboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getLeaderboard(): Promise<LeaderboardItemDto[]> {
    const rawQuery = `
			SELECT
					tul.user_id,
					tul.rank,
					up.points,
					u.nickname,
					up.avatar,
					up.cover_image as cover,
					(count(DISTINCT r.id) FILTER (WHERE r.text IS NOT NULL))::int AS text_count,
					(count(DISTINCT r.id) FILTER (WHERE r.text IS NULL))::int AS no_text_count,
					(SELECT COUNT(*)
					FROM "User_fav_reviews" ufr
					JOIN "Reviews" rev ON ufr.review_id = rev.id
					WHERE rev.user_id = tul.user_id)::int AS received_likes,
					(SELECT COUNT(*)
					FROM "User_fav_reviews" ufr
					JOIN "Reviews" rev ON ufr.review_id = rev.id
					WHERE ufr.user_id = tul.user_id AND rev.user_id != tul.user_id)::int AS given_likes
			FROM "Top_users_leaderboard" tul
			JOIN "User_profiles" up on up.user_id = tul.user_id
			JOIN "Users" u on u.id = up.user_id
			LEFT JOIN "Reviews" r on u.id = r.user_id
			GROUP BY tul.user_id,
							tul.rank,
							up.points,
							u.nickname,
							up.avatar,
							up.cover_image
			ORDER BY up.points DESC
		`;
    return this.prisma.$queryRawUnsafe<LeaderboardItemDto[]>(rawQuery);
  }
}
