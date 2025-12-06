import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'prisma/prisma.service';
import { FeedbackRepliesService } from 'src/feedback-replies/feedback-replies.service';
import { FeedbackStatusesService } from 'src/feedback-statuses/feedback-statuses.service';
import { FeedbackStatusesEnum } from 'src/feedback-statuses/types/feedback-statuses.enum';
import { EntityNotFoundException } from 'src/shared/exceptions/entity-not-found.exception';
import { CreateFeedbackRequestDto } from './dto/request/create-feedback.request.dto';
import { FeedbackQueryDto } from './dto/request/query/feedback.query.dto';
import { UpdateFeedbackRequestDto } from './dto/request/update-feedback.request.dto';
import { FeedbackDto } from './dto/response/feedback.dto';
import { FeedbackResponseDto } from './dto/response/feedback.response.dto';

@Injectable()
export class FeedbackService {
  constructor(
    @Inject(forwardRef(() => FeedbackRepliesService))
    private readonly feedbackResponsesService: FeedbackRepliesService,
    private readonly prisma: PrismaService,
    private readonly statusesService: FeedbackStatusesService,
  ) {}

  /**
   * Create a new feedback record.
   *
   * - Finds the default `NEW` feedback status and assigns it to the
   *   newly created record.
   * - Persists the feedback via Prisma and returns the serialized
   *   `FeedbackDto`.
   *
   * @param dto Request payload containing `email`, `title` and `message`.
   * @returns The created feedback serialized as `FeedbackDto`.
   */
  async create(dto: CreateFeedbackRequestDto): Promise<FeedbackDto> {
    const status = await this.statusesService.findByStatus(
      FeedbackStatusesEnum.NEW,
    );

    if (!status) {
      throw new EntityNotFoundException(
        'Статус отзыва',
        'названием',
        `${FeedbackStatusesEnum.NEW}`,
      );
    }

    const created = await this.prisma.feedback.create({
      data: { ...dto, feedbackStatusId: status.id },
    });

    return plainToInstance(FeedbackDto, created, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * List feedback items with optional filtering, search and pagination.
   *
   * - Validates `statusId` when provided.
   * - Builds a Prisma `where` filter supporting search across email,
   *   title and message fields (case-insensitive).
   * - Returns an object with `meta.count` and `items` array of
   *   serialized `FeedbackDto` objects.
   *
   * @param query Query parameters for filtering, ordering and pagination.
   * @returns Paginated `FeedbackResponseDto`.
   */
  async findAll(query: FeedbackQueryDto): Promise<FeedbackResponseDto> {
    const { limit, offset, order, search, statusId } = query;

    if (statusId) {
      await this.statusesService.findOne(statusId);
    }

    const where: Prisma.FeedbackWhereInput = {};

    if (statusId) {
      where.feedbackStatusId = statusId;
    }

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { title: { contains: search, mode: 'insensitive' } },
        { message: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [count, feedback] = await Promise.all([
      this.prisma.feedback.count({ where }),
      this.prisma.feedback.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: [{ createdAt: order || 'desc' }, { id: 'desc' }],
        include: {
          feedbackStatus: true,
        },
      }),
    ]);

    return {
      meta: { count },
      items: plainToInstance(FeedbackDto, feedback, {
        excludeExtraneousValues: true,
      }),
    };
  }

  /**
   * Retrieve a single feedback item by id.
   *
   * Throws `EntityNotFoundException` when the feedback does not exist.
   *
   * @param id Feedback id
   * @returns Serialized `FeedbackDto` for the requested id
   */
  async findOne(id: string): Promise<FeedbackDto> {
    const existing = await this.prisma.feedback.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new EntityNotFoundException('Отзыв', 'id', `${id}`);
    }

    return plainToInstance(FeedbackDto, existing, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * Update feedback status.
   *
   * Behaviour:
   * - Ensures the target feedback exists.
   * - Validates the requested `feedbackStatusId` and performs special
   *   checks when transitioning to `ANSWERED` — specifically, a reply
   *   must exist for the feedback before the status can be set to
   *   `ANSWERED`.
   * - Applies the status update and returns the updated serialized
   *   `FeedbackDto`.
   *
   * @param id Feedback id to update
   * @param dto Update payload containing `feedbackStatusId`
   * @returns Updated `FeedbackDto`
   */
  async update(
    id: string,
    dto: UpdateFeedbackRequestDto,
  ): Promise<FeedbackDto> {
    await this.findOne(id);
    const status = await this.statusesService.findOne(dto.feedbackStatusId);

    if (
      (status.status as FeedbackStatusesEnum) === FeedbackStatusesEnum.ANSWERED
    ) {
      const response = await this.feedbackResponsesService.findByFeedbackId(id);

      if (!response) {
        throw new ConflictException(
          'Данный статус не может быть установлен без отправки сообщения!',
        );
      }
    }

    const updated = await this.prisma.feedback.update({
      where: { id },
      data: dto,
      include: {
        feedbackStatus: true,
      },
    });

    return plainToInstance(FeedbackDto, updated, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * Delete a feedback item by id.
   *
   * Ensures the feedback exists and removes it from the database.
   *
   * @param id Feedback id to delete
   */
  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.feedback.delete({
      where: { id },
    });

    return;
  }
}
