import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { FeedbackStatusesService } from 'src/feedback-statuses/feedback-statuses.service';
import { FeedbackStatusesEnum } from 'src/feedback-statuses/types/feedback-statuses.enum';
import { FeedbackService } from 'src/feedback/feedback.service';
import { MailsService } from 'src/mails/mails.service';
import { EntityNotFoundException } from 'src/shared/exceptions/entity-not-found.exception';
import { UsersService } from 'src/users/users.service';
import { CreateFeedbackReplyRequestDto } from './dto/request/create-feedback-reply.request.dto';
import { FeedbackReplyDto } from './dto/response/feedback-reply.dto';

@Injectable()
export class FeedbackRepliesService {
  constructor(
    @Inject(forwardRef(() => FeedbackService))
    private readonly feedbackService: FeedbackService,
    private readonly prisma: PrismaService,
    private readonly feedbackStatusesService: FeedbackStatusesService,
    private readonly usersService: UsersService,
    private readonly mailsService: MailsService,
  ) {}

  /**
   * Create and send a reply to a feedback message.
   *
   * Behaviour and steps:
   * - Validates the referenced feedback exists and ensures no existing
   *   reply is present.
   * - Persists the reply record in the database.
   * - Attempts to send the reply email via `MailsService`.
   *   - If email delivery fails, the persisted reply is deleted and an
   *     `InternalServerErrorException` is thrown.
   * - On successful delivery the feedback's status is updated to
   *   `ANSWERED` and the created reply is returned as `FeedbackReplyDto`.
   *
   * Side-effects:
   * - Creates a `feedbackResponse` record and updates the parent
   *   feedback status on success. Rolls back the `feedbackResponse` on
   *   email/send or status resolution failures.
   *
   * @param dto Reply creation payload containing `message` and `feedbackId`.
   * @param userId Id of the user sending the reply.
   * @returns Serialized `FeedbackReplyDto` for the created reply.
   */
  async create(
    dto: CreateFeedbackReplyRequestDto,
    userId: string,
  ): Promise<FeedbackReplyDto> {
    const feedback = await this.feedbackService.findOne(dto.feedbackId);

    const exist = await this.findByFeedbackId(dto.feedbackId);
    if (exist) {
      throw new ConflictException('Ответ на данное сообщение уже существует');
    }

    const user = await this.usersService.findOne(userId);

    // Persist reply record first. If sending the email fails we must
    // delete this record to keep consistent state.
    const created = await this.prisma.feedbackResponse.create({
      data: {
        ...dto,
        userId,
      },
      include: {
        user: { select: { nickname: true, id: true } },
      },
    });

    // Attempt to send the response email. If sending fails, remove the
    // created DB record and surface an error.
    try {
      await this.mailsService.sendResponseEmail(
        feedback.email,
        user.nickname,
        dto.message,
      );
    } catch {
      await this.prisma.feedbackResponse.delete({
        where: { id: created.id },
      });
      throw new InternalServerErrorException('Не удалось отправить письмо');
    }

    // If email sent, set feedback status to ANSWERED and return serialized reply
    const newStatus = await this.feedbackStatusesService.findByStatus(
      FeedbackStatusesEnum.ANSWERED,
    );

    // If status is missing, rollback created reply and throw
    if (!newStatus) {
      await this.prisma.feedbackResponse.delete({
        where: { id: created.id },
      });

      throw new EntityNotFoundException(
        'Статус сообщения',
        'названием',
        FeedbackStatusesEnum.ANSWERED,
      );
    }

    const updated = await this.feedbackService.update(dto.feedbackId, {
      feedbackStatusId: newStatus.id,
    });

    return {
      id: created.id,
      message: created.message,
      createdAt: created.createdAt.toISOString(),
      feedback: updated,
      user: created.user ?? undefined,
    };
  }

  /**
   * Find a feedback reply by the parent feedback id.
   *
   * - Validates that the referenced feedback exists.
   * - Loads the reply row (if any) including the user relation and returns
   *   a serialized `FeedbackReplyDto` or `null` when no reply exists.
   *
   * @param feedbackId Parent feedback id
   * @returns `FeedbackReplyDto` or `null` when not found
   */
  async findByFeedbackId(feedbackId: string): Promise<FeedbackReplyDto | null> {
    await this.feedbackService.findOne(feedbackId);

    const reply = await this.prisma.feedbackResponse.findUnique({
      where: { feedbackId },
      include: {
        user: { select: { nickname: true, id: true } },
      },
    });

    const feedback = await this.feedbackService.findOne(feedbackId);

    if (!reply) return null;

    return {
      id: reply.id,
      message: reply.message,
      createdAt: reply.createdAt.toISOString(),
      feedback,
      user: reply.user ?? undefined,
    };
  }
}
