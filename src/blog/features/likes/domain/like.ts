import { LikeStatusType } from '../dto/like.input.model';
import { User } from '../../../../account/features/users/domain/user';

export class Like {
  user: User;
  likeStatus: LikeStatusType;
}
