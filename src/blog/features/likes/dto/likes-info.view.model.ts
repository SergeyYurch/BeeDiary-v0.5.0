import { LikeStatusType } from './like.input.model';

export interface LikesInfoViewModel {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatusType;
}
