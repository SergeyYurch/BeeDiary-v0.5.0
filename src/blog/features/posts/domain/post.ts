import { PostCreateDto } from '../dto/post-create.dto';
import { PostUpdateDto } from '../dto/post-update.dto';
import { LikeDetailsViewModel } from '../../likes/dto/like-details.view.model';
import { LikesCountsType } from '../../likes/types/likes-counts.type';
import { LikesInfoType } from '../../likes/types/likes-info.type';
import { Blog } from '../../blogs/domain/blog';
import { User } from '../../../../account/features/users/domain/user';
import { Like } from '../../likes/domain/like';

export class Post {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogger: User;
  blog: Blog;
  createdAt: number;
  newestLikes: LikeDetailsViewModel[];
  likesCounts: LikesCountsType;
  updatedLike: Like | null;
  likes: LikesInfoType;

  constructor() {
    this.newestLikes = [];
    this.likesCounts = {
      likesCount: 0,
      dislikesCount: 0,
    };
    this.likes = {
      likesCount: 0,
      dislikesCount: 0,
      myStatus: 'None',
    };
    this.updatedLike = null;
  }

  initial(postDto: PostCreateDto) {
    this.title = postDto.title;
    this.shortDescription = postDto.shortDescription;
    this.content = postDto.content;
    this.blog = postDto.blog;
    this.blogger = postDto.blogger;
    this.createdAt = Date.now();
  }

  updatePost(postDto: PostUpdateDto) {
    this.title = postDto.title;
    this.shortDescription = postDto.shortDescription;
    this.content = postDto.content;
  }
}
