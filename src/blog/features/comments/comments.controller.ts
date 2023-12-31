import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AccessTokenGuard } from '../../../account/guards/access-token.guard';
import { CommentInputModel } from './dto/comment-input.model';
import { LikeInputModel } from '../likes/dto/like.input.model';
import { CommandBus } from '@nestjs/cqrs';
import { DeleteCommentCommand } from './providers/use-cases/delete-comment-use-case';
import { UpdateCommentCommand } from './providers/use-cases/update-comment-use-case';
import { UpdateLikeStatusCommand } from './providers/use-cases/update-like-status-use-case';
import { CurrentUserId } from '../../../account/decorators/current-user-id.param.decorator';
import { CheckCommentIdGuard } from '../../guards/check-comment-id.guard';
import { CommentOwnerGuard } from '../../guards/comment-owner.guard';
import { CommentsQueryTypeOrmRepository } from './providers/comments.query.type-orm.repository';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(
    private commentsQueryRepository: CommentsQueryTypeOrmRepository,
    private commandBus: CommandBus,
  ) {}

  @UseGuards(CheckCommentIdGuard)
  @Get(':commentId')
  async getCommentsForPost(
    @Param('commentId') commentId: string,
    @CurrentUserId() userId: string,
  ) {
    return this.commentsQueryRepository.getCommentById(commentId, { userId });
  }

  @UseGuards(CommentOwnerGuard)
  @UseGuards(CheckCommentIdGuard)
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':commentId')
  async delete(@Param('commentId') commentId: string) {
    await this.commandBus.execute(new DeleteCommentCommand(commentId));
  }

  @UseGuards(CommentOwnerGuard)
  @UseGuards(CheckCommentIdGuard)
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':commentId')
  async update(
    @Param('commentId') commentId: string,
    @Body() commentDto: CommentInputModel,
  ) {
    await this.commandBus.execute(
      new UpdateCommentCommand(commentId, commentDto),
    );
  }

  @UseGuards(CheckCommentIdGuard)
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':commentId/like-status')
  async updateLikeStatus(
    @Param('commentId') commentId: string,
    @Body() likeDto: LikeInputModel,
    @CurrentUserId() userId: string,
  ) {
    return this.commandBus.execute(
      new UpdateLikeStatusCommand(commentId, userId, likeDto.likeStatus),
    );
  }
}
