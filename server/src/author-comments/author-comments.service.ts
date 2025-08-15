import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthorComment } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { RegisteredAuthorsService } from 'src/registered-authors/registered-authors.service';
import { ReleasesService } from 'src/releases/releases.service';
import { EntityNotFoundException } from 'src/shared/exceptions/entity-not-found.exception';
import { InsufficientPermissionsException } from 'src/shared/exceptions/insufficient-permissions.exception';
import { FindAuthorCommentsQuery } from './dto/query/find-author-comments.query.dto';
import { CreateAuthorCommentRequestDto } from './dto/request/create-author-comment.request.dto';
import { UpdateAuthorCommentRequestDto } from './dto/request/update-author-comment.request.dto';
import { AuthorCommentResponseDto } from './dto/response/author-comment.response.dto';
import { FindAuthorCommentsResponseDto } from './dto/response/find-author-comments.response.dto';

@Injectable()
export class AuthorCommentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly releasesService: ReleasesService,
    private readonly registeredAuthorsService: RegisteredAuthorsService,
  ) {}

  async create(
    dto: CreateAuthorCommentRequestDto,
    userId: string,
  ): Promise<AuthorCommentResponseDto> {
    await this.registeredAuthorsService.checkUserIsReleaseAuthor(
      userId,
      dto.releaseId,
    );
    const exist = await this.findByUserReleaseIds(userId, dto.releaseId);

    if (exist) {
      throw new ForbiddenException(
        'Вы уже оставляли авторский комментарий на данный релиз!',
      );
    }

    const created = await this.prisma.authorComment.create({
      data: {
        userId,
        ...dto,
      },
    });

    return this.getCommentDto(created.id);
  }

  async findByReleaseId(
    releaseId: string,
  ): Promise<AuthorCommentResponseDto[]> {
    await this.releasesService.findOne(releaseId);

    const query = `
    ${this.baseQuery}
    WHERE ac.release_id = '${releaseId}'
    ORDER BY ac.created_at DESC, ac.id DESC
  `;

    return this.prisma.$queryRawUnsafe<AuthorCommentResponseDto[]>(query);
  }

  async update(
    id: string,
    dto: UpdateAuthorCommentRequestDto,
    userId?: string,
  ): Promise<AuthorCommentResponseDto> {
    const comment = await this.findOne(id);
    if (userId && userId !== comment.userId) {
      throw new InsufficientPermissionsException();
    }

    if (userId) {
      await this.registeredAuthorsService.checkUserIsReleaseAuthor(
        userId,
        comment.releaseId,
      );
    }

    const updated = await this.prisma.authorComment.update({
      where: { id },
      data: dto,
    });
    return this.getCommentDto(updated.id);
  }

  async delete(id: string, userId?: string) {
    const comment = await this.findOne(id);
    if (userId && userId !== comment.userId) {
      throw new InsufficientPermissionsException();
    }

    if (userId) {
      await this.registeredAuthorsService.checkUserIsReleaseAuthor(
        userId,
        comment.releaseId,
      );
    }

    return this.prisma.authorComment.delete({
      where: { id },
    });
  }

  async findOne(id: string): Promise<AuthorComment> {
    const comment = await this.prisma.authorComment.findUnique({
      where: { id },
    });

    if (!comment) {
      throw new EntityNotFoundException('Комментарий автора', 'id', id);
    }
    return comment;
  }

  async findByUserReleaseIds(
    userId: string,
    releaseId: string,
  ): Promise<AuthorComment | null> {
    return this.prisma.authorComment.findUnique({
      where: { userId_releaseId: { userId, releaseId } },
    });
  }

  async findAll(
    query: FindAuthorCommentsQuery,
  ): Promise<FindAuthorCommentsResponseDto> {
    const { limit, offset = 0, order = 'DESC', query: searchQuery } = query;

    const searchCondition = searchQuery
      ? `WHERE (
         ac.title ILIKE '%${searchQuery}%' OR 
         ac.text ILIKE '%${searchQuery}%' OR 
         u.nickname ILIKE '%${searchQuery}%' OR 
         r.title ILIKE '%${searchQuery}%'
       )`
      : '';

    const rawQuery = `
    ${this.baseQuery}
    ${searchCondition}
    ORDER BY ac.created_at ${order}, ac.id DESC
    ${limit !== undefined ? `LIMIT ${limit}` : ''} OFFSET ${offset}
  `;

    const [count, comments] = await Promise.all([
      this.prisma.authorComment.count({
        where: {
          OR: [
            { title: { contains: searchQuery, mode: 'insensitive' } },
            { text: { contains: searchQuery, mode: 'insensitive' } },
            {
              user: {
                nickname: { contains: searchQuery, mode: 'insensitive' },
              },
            },
            {
              release: {
                title: { contains: searchQuery, mode: 'insensitive' },
              },
            },
          ],
        },
      }),
      this.prisma.$queryRawUnsafe<AuthorCommentResponseDto[]>(rawQuery),
    ]);

    return { count, comments };
  }

  private async getCommentDto(
    commentId: string,
  ): Promise<AuthorCommentResponseDto> {
    const query = `
    ${this.baseQuery}
    WHERE ac.id = '${commentId}'
  `;

    const [result] =
      await this.prisma.$queryRawUnsafe<AuthorCommentResponseDto[]>(query);

    return result;
  }

  private baseQuery = `
      WITH user_author_types AS (
          SELECT
              ra.user_id,
              json_agg(DISTINCT jsonb_build_object('id', at.id, 'type', at.type)) AS types
          FROM "Registered_authors" ra
              JOIN "Authors_on_types" aot ON aot.author_id = ra.author_id
              JOIN "Author_types" at ON at.id = aot.author_type_id
          GROUP BY ra.user_id
      ),
          user_comments_count AS (
              SELECT
                  user_id,
                  COUNT(*)::int AS total_comments
              FROM "Author_comments"
              GROUP BY user_id
          ),
          user_author_like_count AS (
              SELECT
                  user_id,
                  SUM(cnt)::int AS total_author_likes
              FROM (
                      SELECT
                          ufr.user_id,
                          COUNT(*)::int AS cnt
                      FROM "User_fav_reviews" ufr
                          JOIN "Reviews" rv ON rv.id = ufr.review_id
                      WHERE EXISTS (
                            SELECT 1
                            FROM "Registered_authors" ra
                            WHERE ra.user_id = ufr.user_id
                              AND ra.author_id IN (
                                SELECT rp.author_id 
                                FROM "Release_producers" rp 
                                WHERE rp.release_id = rv.release_id
                                UNION
                                SELECT ar.author_id 
                                FROM "Release_artists" ar 
                                WHERE ar.release_id = rv.release_id
                                UNION
                                SELECT rd.author_id 
                                FROM "Release_designers" rd 
                                WHERE rd.release_id = rv.release_id
                            )
                      )
                      GROUP BY ufr.user_id
                      UNION ALL
                      SELECT
                          ufm.user_id,
                          COUNT(*)::int AS cnt
                      FROM "User_fav_media" ufm
                          JOIN "Release_media" rm ON rm.id = ufm.media_id
                      WHERE EXISTS (
                            SELECT 1
                            FROM "Registered_authors" ra
                            WHERE ra.user_id = ufm.user_id
                              AND ra.author_id IN (
                                SELECT rp.author_id 
                                FROM "Release_producers" rp 
                                WHERE rp.release_id = rm.release_id
                                UNION
                                SELECT ar.author_id 
                                FROM "Release_artists" ar 
                                WHERE ar.release_id = rm.release_id
                                UNION
                                SELECT rd.author_id 
                                FROM "Release_designers" rd 
                                WHERE rd.release_id = rm.release_id
                            )
                      )
                      GROUP BY ufm.user_id
              ) z
              GROUP BY user_id
          )
      SELECT
          ac.id,
          ac.title,
          ac.text,
          TO_CHAR(ac.created_at, 'DD-MM-YYYY') AS "createdAt",
          u.id AS "userId",
          u.nickname,
          up.avatar,
          up.points,
          ac.release_id AS "releaseId",
          r.img AS "releaseImg",
          r.title AS "releaseTitle",
          tul.rank AS position,
          COALESCE((
              SELECT types FROM user_author_types WHERE user_id = u.id
          ), '[]'::json) AS "authorTypes",
          COALESCE(ucc.total_comments, 0) AS "totalComments",
          COALESCE(ualc.total_author_likes, 0) AS "totalAuthorLikes"
      FROM "Author_comments" ac
          JOIN "Users" u ON u.id = ac.user_id
          LEFT JOIN "User_profiles" up ON up.user_id = u.id
          LEFT JOIN user_comments_count ucc ON ucc.user_id = u.id
          JOIN "Releases" r ON ac.release_id = r.id
          LEFT JOIN "Top_users_leaderboard" tul ON u.id = tul.user_id
          LEFT JOIN user_author_like_count ualc ON ualc.user_id = u.id
    `;
}
