import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { EntityNotFoundException } from 'src/exceptions/entity-not-found.exception';
import { FeedbackService } from 'src/feedback/feedback.service';
import { UsersService } from 'src/users/users.service';
import { CreateFeedbackResponseDto } from './dto/create-feedback-response.dto';

@Injectable()
export class FeedbackResponsesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly feedbackService: FeedbackService,
    private readonly usersService: UsersService,
  ) {}

  async create(createFeedbackResponseDto: CreateFeedbackResponseDto) {
    await this.feedbackService.findById(createFeedbackResponseDto.feedbackId);

    await this.usersService.findOne(createFeedbackResponseDto.userId);

    return this.prisma.feedbackResponse.create({
      data: createFeedbackResponseDto,
    });
  }

  async findByFeedbackId(feedbackId: string) {
    await this.feedbackService.findById(feedbackId);

    const result = await this.prisma.feedbackResponse.findUnique({
      where: { feedbackId },
    });

    if (!result) {
      throw new EntityNotFoundException('Ответ', 'feedbackId', feedbackId);
    }

    return result;
  }
}
