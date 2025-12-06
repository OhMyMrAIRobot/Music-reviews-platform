import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { IAuthenticatedRequest } from 'src/auth/types/authenticated-request.interface';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { NominationWinnersQueryDto } from './dto/query/nomination-winners.query.dto';
import { CreateNominationVoteRequestDto } from './dto/request/create-nomination-vote.request.dto';
import { NominationsService } from './nominations.service';

@Controller('nominations')
export class NominationsController {
  constructor(private readonly nominationsService: NominationsService) {}

  /**
   * Get /nominations
   *
   * Return nomination winners for available periods.
   *
   * - Accepts optional `year` and `month` query parameters to filter the
   *   result to a specific period.
   * - Returns aggregated winners grouped by month.
   *
   * @param query Query DTO with optional `year` and `month` filters
   */
  @Get()
  findWinners(@Query() query: NominationWinnersQueryDto) {
    return this.nominationsService.findNominationWinners(query);
  }

  /**
   * Get /nominations/candidates
   *
   * Return nomination candidates for the current nomination period.
   *
   * The response contains grouped candidate arrays and period metadata.
   */
  @Get('candidates')
  findCandidates() {
    return this.nominationsService.findCandidates();
  }

  /**
   * Get /nominations/votes
   *
   * Return the authenticated user's votes for the current nomination period.
   *
   * Requires a valid JWT. The method reads `req.user.id` and returns the
   * votes placed by that user during the current period.
   *
   * @param req Authenticated request containing `user.id`
   */
  @Get('votes')
  @UseGuards(JwtAuthGuard)
  findUserVotes(@Request() req: IAuthenticatedRequest) {
    return this.nominationsService.findUserVotes(req.user.id);
  }

  /**
   * Get /nominations/author/:authorId
   *
   * Return nomination wins for a specific author.
   *
   * The endpoint returns the list of nominations where the provided
   * `authorId` won.
   *
   * @param authorId Author id to lookup nomination participations for
   */
  @Get('author/:authorId')
  findAuthorNominationWins(@Param('authorId') authorId: string) {
    return this.nominationsService.findAuthorNominationWins(authorId);
  }

  /**
   * Post /nominations
   *
   * Create a nomination vote for the authenticated user.
   *
   * Validates the nomination type and the nominated entity's eligibility
   * for the current period. Authentication is required.
   *
   * @param dto Request DTO containing `nominationTypeId`, `entityKind` and `entityId`
   * @param req Authenticated request containing `user.id`
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  addNominationVote(
    @Body() dto: CreateNominationVoteRequestDto,
    @Request() req: IAuthenticatedRequest,
  ) {
    return this.nominationsService.createNominationVote(dto, req.user.id);
  }
}
