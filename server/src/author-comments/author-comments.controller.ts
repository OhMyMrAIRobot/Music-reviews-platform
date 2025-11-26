import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { IAuthenticatedRequest } from 'src/auth/types/authenticated-request.interface';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { AuthorCommentsService } from './author-comments.service';
import { AuthorCommentsQueryDto } from './dto/query/author-comments.query.dto';
import { CreateAuthorCommentRequestDto } from './dto/request/create-author-comment.request.dto';
import { UpdateAuthorCommentRequestDto } from './dto/request/update-author-comment.request.dto';

@Controller('author-comments')
export class AuthorCommentsController {
  constructor(private readonly authorCommentsService: AuthorCommentsService) {}
  /**
   * POST /author-comments
   *
   * Create a new author comment. Requires authentication — only registered
   * authors for the target release are allowed to create a comment.
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() dto: CreateAuthorCommentRequestDto,
    @Request() req: IAuthenticatedRequest,
  ) {
    return this.authorCommentsService.create(dto, req.user.id);
  }

  /**
   * GET /author-comments
   *
   * Returns a paginated list of author comments according to query filters.
   * Delegates to `AuthorCommentsService.findAll`.
   */
  @Get()
  findAll(@Query() query: AuthorCommentsQueryDto) {
    return this.authorCommentsService.findAll(query);
  }

  /**
   * GET /author-comments/release/:releaseId
   *
   * Returns author comments for a specific release. Validates the release
   * exists and delegates to the service.
   */
  @Get('release/:releaseId')
  findByReleaseId(@Param('releaseId') releaseId: string) {
    return this.authorCommentsService.findByReleaseId(releaseId);
  }

  /**
   * PATCH /author-comments/:id
   *
   * Update an existing author comment. Requires authentication and enforces
   * ownership checks in the service layer.
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateAuthorCommentRequestDto,
    @Request() req: IAuthenticatedRequest,
  ) {
    return this.authorCommentsService.update(id, dto, req.user.id);
  }

  /**
   * DELETE /author-comments/:id
   *
   * Delete an author comment owned by the authenticated user. Ownership
   * and permissions are enforced in the service layer.
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  delete(@Param('id') id: string, @Request() req: IAuthenticatedRequest) {
    return this.authorCommentsService.delete(id, req.user.id);
  }
}
