import { Blog } from '../../blogs/domain/blog';
import { User } from '../../../../account/features/users/domain/user';

export class PostCreateDto {
  title: string;
  shortDescription: string;
  content: string;
  blog: Blog;
  blogger: User;
}
