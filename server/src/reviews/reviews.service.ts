import { Injectable } from '@nestjs/common';
import { Review } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { DuplicateFieldException } from 'src/exceptions/duplicate-field.exception';
import { EntityNotFoundException } from 'src/exceptions/entity-not-found.exception';
import { ReleasesService } from 'src/releases/releases.service';
import { UsersService } from 'src/users/users.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { DeleteReviewDto } from './dto/delete-review.dto';
import { ReviewResponseDto } from './dto/review.response.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly releasesService: ReleasesService,
  ) {}

  async create(
    createReviewDto: CreateReviewDto,
    userId: string,
  ): Promise<Review> {
    const { releaseId } = createReviewDto;

    await this.usersService.findOne(userId);
    await this.releasesService.findOne(releaseId);

    const existing = await this.findByUserIdReleaseId(userId, releaseId);
    if (existing) {
      throw new DuplicateFieldException(
        `Рецензия с id пользователя '${userId}' и`,
        'id релиза',
        `${releaseId}`,
      );
    }
    const total = this.calculateTotalScore(
      createReviewDto.rhymes,
      createReviewDto.structure,
      createReviewDto.realization,
      createReviewDto.individuality,
      createReviewDto.atmosphere,
    );

    return this.prisma.review.create({
      data: { ...createReviewDto, total, userId },
    });
  }

  async findAll(): Promise<Review[]> {
    return this.prisma.review.findMany();
  }

  async findOne(id: string): Promise<Review> {
    const existing = await this.prisma.review.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new EntityNotFoundException('Рецензия', 'id', `${id}`);
    }

    return existing;
  }

  async findByUserId(userId: string): Promise<Review[]> {
    const existing = await this.prisma.review.findMany({
      where: { userId },
    });
    if (existing.length === 0) {
      throw new EntityNotFoundException('Рецензии', 'userId', `${userId}`);
    }

    return existing;
  }

  async findByReleaseId(releaseId: string): Promise<Review[]> {
    const existing = await this.prisma.review.findMany({
      where: { releaseId },
    });
    if (existing.length === 0) {
      throw new EntityNotFoundException(
        'Рецензии',
        'releaseId',
        `${releaseId}`,
      );
    }

    return existing;
  }

  async update(
    updateReviewDto: UpdateReviewDto,
    userId: string,
  ): Promise<Review> {
    const { releaseId } = updateReviewDto;

    await this.usersService.findOne(userId);
    await this.releasesService.findOne(releaseId);

    const existing = await this.findByUserIdReleaseId(userId, releaseId);
    if (!existing) {
      throw new EntityNotFoundException(
        `Рецензия с id пользователя '${userId}' и`,
        'id релиза',
        `${releaseId}`,
      );
    }
    const total = this.calculateTotalScore(
      updateReviewDto.rhymes,
      updateReviewDto.structure,
      updateReviewDto.realization,
      updateReviewDto.individuality,
      updateReviewDto.atmosphere,
    );

    return this.prisma.review.update({
      where: { userId_releaseId: { userId, releaseId } },
      data: { ...updateReviewDto, total },
    });
  }

  async remove(
    deleteReviewDto: DeleteReviewDto,
    userId: string,
  ): Promise<Review> {
    const { releaseId } = deleteReviewDto;
    const existing = await this.findByUserIdReleaseId(userId, releaseId);
    if (!existing) {
      throw new EntityNotFoundException(
        `Рецензия с id пользователя '${userId}' и`,
        'id релиза',
        `${releaseId}`,
      );
    }

    return this.prisma.review.delete({
      where: { userId_releaseId: { userId, releaseId } },
    });
  }

  async findReviews(
    field: 'rev.created_at' | 'rev.total' = 'rev.created_at',
    order: 'asc' | 'desc' = 'desc',
    limit: number = 45,
    offset: number = 0,
  ): Promise<ReviewResponseDto[]> {
    const rawQuery = `
      WITH ranked_profiles AS (
          SELECT
              user_id,
              ROW_NUMBER() OVER (ORDER BY points DESC)::int AS position
          FROM "User_profiles"
          ORDER BY points DESC
          LIMIT 5
      )

      SELECT
          rev.id,
          rev.title,
          rev.text,
          rev.total,
          rev.rhymes,
          rev.structure,
          rev.realization,
          rev.individuality,
          rev.atmosphere,
          u.nickname,
          p.avatar AS profile_img,
          p.points,
          rp.position,
          r.img AS release_img,
          r.title AS release_title,
          r.id AS release_id,
          COUNT(DISTINCT ufr.user_id)::int AS likes_count,
          json_agg(DISTINCT jsonb_build_object('user_id', ufr.user_id)) AS like_user_ids
      FROM "Reviews" rev
              LEFT JOIN "Users" u ON rev.user_id = u.id
              LEFT JOIN "User_profiles" p ON u.id = p.user_id
              LEFT JOIN ranked_profiles rp ON p.user_id = rp.user_id
              LEFT JOIN "Releases" r ON rev.release_id = r.id
              LEFT JOIN "User_fav_reviews" ufr ON rev.id = ufr.review_id
      WHERE rev.text IS NOT NULL AND rev.title IS NOT NULL
      GROUP BY
          rev.id, rev.title, rev.text, rev.total, rev.rhymes, rev.structure, rev.realization,
          rev.individuality, rev.atmosphere, u.nickname, p.avatar, p.points, rp.position,
          r.img, r.title, r.id, rev.created_at
      ORDER BY ${field} ${order}
      LIMIT ${limit}
      OFFSET ${offset}`;

    return this.prisma.$queryRawUnsafe<ReviewResponseDto[]>(rawQuery);
  }

  private calculateTotalScore(
    rhymes: number,
    structure: number,
    realization: number,
    individuality: number,
    atmosphere: number,
  ): number {
    const baseScore = rhymes + structure + realization + individuality;

    const multipliedBaseScore = baseScore * 1.4;

    const atmosphereMultiplier = 1 + (atmosphere - 1) * 0.06747;

    return Math.round(multipliedBaseScore * atmosphereMultiplier);
  }

  private async findByUserIdReleaseId(
    userId: string,
    releaseId: string,
  ): Promise<Review | null> {
    return this.prisma.review.findUnique({
      where: { userId_releaseId: { userId, releaseId } },
    });
  }
}
