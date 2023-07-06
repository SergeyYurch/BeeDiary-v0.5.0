import { LikeStatusType } from '../../likes/dto/like.input.model';

export class LikeForPost {
  userId: string;
  login: string;
  likeStatus: LikeStatusType;
  addedAt: number;
  updatedAt: number;
}
