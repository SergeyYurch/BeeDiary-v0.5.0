import { LikeStatusType } from '../dto/like.input.model';

export type LikeWithAddedAtType = {
  userId: string;
  login: string;
  likeStatus: LikeStatusType;
  addedAt: number;
};
