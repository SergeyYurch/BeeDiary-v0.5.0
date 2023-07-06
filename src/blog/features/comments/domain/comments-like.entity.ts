import { LikeStatusType } from '../../likes/dto/like.input.model';

export class CommentsLikeEntity {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatusType;
}
