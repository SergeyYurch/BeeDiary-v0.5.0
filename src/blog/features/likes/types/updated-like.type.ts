import { LikeStatusType } from '../dto/like.input.model';

export type LikeType = {
  userId: string;
  login: string;
  likeStatus: LikeStatusType;
};
