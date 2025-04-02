import { Injectable } from '@nestjs/common';
import { Review } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { DuplicateFieldException } from 'src/exceptions/duplicate-field.exception';
import { EntityNotFoundException } from 'src/exceptions/entity-not-found.exception';
import { ReleasesService } from 'src/releases/releases.service';
import { UsersService } from 'src/users/users.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { DeleteReviewDto } from './dto/delete-review.dto';
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

    const existing = await this.findOne(userId, releaseId);
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

    const existing = await this.findOne(userId, releaseId);
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
    const existing = await this.findOne(userId, releaseId);
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

  private async findOne(
    userId: string,
    releaseId: string,
  ): Promise<Review | null> {
    return this.prisma.review.findUnique({
      where: { userId_releaseId: { userId, releaseId } },
    });
  }
}
