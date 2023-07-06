import { LikeStatusType } from '../dto/like.input.model';

export interface LikesInfoType {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatusType;
}
