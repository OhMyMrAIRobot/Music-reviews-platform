import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthorComment } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { RegisteredAuthorsService } from 'src/registered-authors/registered-authors.service';
import { ReleasesService } from 'src/releases/releases.service';
import { EntityNotFoundException } from 'src/shared/exceptions/entity-not-found.exception';
import { InsufficientPermissionsException } from 'src/shared/exceptions/insufficient-permissions.exception';
import { CreateAuthorCommentRequestDto } from './dto/request/create-author-comment.request.dto';
import { UpdateAuthorCommentRequestDto } from './dto/request/update-author-comment.request.dto';
import { FindAuthorCommentsByReleaseIdResponseDto } from './dto/response/find-author-comments-by-release-id.response.dto';

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
  ): Promise<FindAuthorCommentsByReleaseIdResponseDto> {
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
  ): Promise<FindAuthorCommentsByReleaseIdResponseDto[]> {
    await this.releasesService.findOne(releaseId);

    const query = `
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
    )

    SELECT
      ac.id,
      ac.title,
      ac.text,
      TO_CHAR(ac.created_at, 'DD-MM-YYYY') AS "createdAt",
      u.id AS "userId",
      u.nickname,
      up.avatar,
      COALESCE((
        SELECT types FROM user_author_types WHERE user_id = u.id
      ), '[]'::json) AS "authorTypes",
      COALESCE(ucc.total_comments, 0) AS "totalComments"
    FROM "Author_comments" ac
    JOIN "Users" u ON u.id = ac.user_id
    LEFT JOIN "User_profiles" up ON up.user_id = u.id
    LEFT JOIN user_comments_count ucc ON ucc.user_id = u.id
    WHERE ac.release_id = '${releaseId}'
    ORDER BY ac.created_at DESC, ac.id DESC
  `;

    return this.prisma.$queryRawUnsafe<
      FindAuthorCommentsByReleaseIdResponseDto[]
    >(query);
  }

  async update(
    id: string,
    userId: string,
    dto: UpdateAuthorCommentRequestDto,
  ): Promise<FindAuthorCommentsByReleaseIdResponseDto> {
    const comment = await this.findOne(id);
    if (userId !== comment.userId) {
      throw new InsufficientPermissionsException();
    }

    await this.registeredAuthorsService.checkUserIsReleaseAuthor(
      userId,
      comment.releaseId,
    );

    const updated = await this.prisma.authorComment.update({
      where: { id },
      data: dto,
    });
    return this.getCommentDto(updated.id);
  }

  async delete(id: string, userId: string) {
    const comment = await this.findOne(id);
    if (userId !== comment.userId) {
      throw new InsufficientPermissionsException();
    }
    await this.registeredAuthorsService.checkUserIsReleaseAuthor(
      userId,
      comment.releaseId,
    );
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

  private async getCommentDto(
    commentId: string,
  ): Promise<FindAuthorCommentsByReleaseIdResponseDto> {
    const query = `
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
    )

    SELECT
      ac.id,
      ac.title,
      ac.text,
      TO_CHAR(ac.created_at, 'DD-MM-YYYY') AS "createdAt",
      u.id AS "userId",
      u.nickname,
      up.avatar,
      COALESCE((
        SELECT types FROM user_author_types WHERE user_id = u.id
      ), '[]'::json) AS "authorTypes",
      COALESCE(ucc.total_comments, 0) AS "totalComments"
    FROM "Author_comments" ac
    JOIN "Users" u ON u.id = ac.user_id
    LEFT JOIN "User_profiles" up ON up.user_id = u.id
    LEFT JOIN user_comments_count ucc ON ucc.user_id = u.id
    WHERE ac.id = '${commentId}'
  `;

    const [result] =
      await this.prisma.$queryRawUnsafe<
        [FindAuthorCommentsByReleaseIdResponseDto]
      >(query);

    return result;
  }
}
