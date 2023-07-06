import { LikeStatusType } from '../../likes/dto/like.input.model';

export type LikeSqlDataType = {
  userId: string;
  login: string;
  likeStatus: LikeStatusType;
  addedAt: number;
  updatedAt: number;
};
