import { LikeStatusType } from './like.input.model';

export class LikeDto {
  userId: string;
  login: string;
  likeStatus: LikeStatusType;
}
