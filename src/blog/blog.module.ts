import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { PostEntity } from './features/posts/entities/post.entity';
import { BlogEntity } from './features/blogs/entities/blog.entity';
import { BlogsBannedUserEntity } from './features/blogs/entities/blogs-banned-user.entity';
import { LikeEntity } from './features/likes/entities/like.entity';
import { CommentEntity } from './features/comments/entities/comment.entity';
import { JwtService } from '@nestjs/jwt';
import { BloggerBlogsController } from './features/blogs/api/blogger-blogs.controller';
import { BanPostsUseCase } from './features/posts/providers/use-cases/ban-posts-use-case';
import { PostsController } from './features/posts/posts.controller';
import { CreateNewPostUseCase } from './features/posts/providers/use-cases/create-new-post-use-case';
import { BlogsController } from './features/blogs/api/blogs.controller';
import { UsersTypeOrmRepository } from '../account/features/users/providers/users.typeorm.repository';
import { BlogsQueryTypeOrmRepository } from './features/blogs/providers/blogs.query.type-orm.repository';
import { BloggerUsersController } from './features/blogs/api/blogger-users.controller';
import { PostsQueryTypeOrmRepository } from './features/posts/providers/posts.query.type-orm.repository';
import { UpdateCommentUseCase } from './features/comments/providers/use-cases/update-comment-use-case';
import { DeleteCommentUseCase } from './features/comments/providers/use-cases/delete-comment-use-case';
import { CommentsTypeOrmRepository } from './features/comments/providers/comments.type-orm.repository';
import { BlogsTypeOrmRepository } from './features/blogs/providers/blogs.type-orm.repository';
import { UpdateLikeStatusUseCase } from './features/comments/providers/use-cases/update-like-status-use-case';
import { CreateCommentUseCase } from './features/comments/providers/use-cases/create-comment-use-case';
import { DeleteBlogUseCase } from './features/blogs/providers/use-cases/delete-blog-use-case';
import { BindBlogWithUserUseCase } from './features/blogs/providers/use-cases/bind-blog-with-user-use-case';
import { LikesQueryTypeOrmRepository } from './features/likes/providers/likes.query.type-orm.repository';
import { EditBlogUseCase } from './features/blogs/providers/use-cases/edit-blog-use-case';
import { SecurityService } from '../account/features/security/providers/security.service';
import { BanBlogUseCase } from './features/blogs/providers/use-cases/ban-blog-use-case';
import { SaUsersController } from '../account/api/sa-users.controller';
import { UsersService } from '../account/features/users/providers/users.service';
import { CommentsController } from './features/comments/comments.controller';
import { DeletePostUseCase } from './features/posts/providers/use-cases/delete-post-use-case';
import { CreateNewBlogUseCase } from './features/blogs/providers/use-cases/create-new-blog-use-case';
import { AuthController } from '../account/api/auth.controller';
import { CommentsQueryTypeOrmRepository } from './features/comments/providers/comments.query.type-orm.repository';
import { SaBlogsController } from './features/blogs/api/sa-blogs.controller';
import { UsersQueryTypeormRepository } from '../account/features/users/providers/users.query-typeorm.repository';
import { ConfigService } from '@nestjs/config';
import { SecurityController } from '../account/api/security.controller';
import { LikesTypeOrmRepository } from './features/likes/providers/likes.type-orm.repository';
import { PostsTypeOrmRepository } from './features/posts/providers/posts.type-orm.repository';
import { EditPostUseCase } from './features/posts/providers/use-cases/edit-post-use-case';
import { UpdatePostLikeStatusUseCase } from './features/posts/providers/use-cases/update-post-like-status-use-case';
import { AccountModule } from '../account/account.module';

const blogsUseCases = [
  BindBlogWithUserUseCase,
  CreateNewBlogUseCase,
  EditBlogUseCase,
  DeleteBlogUseCase,
  BanBlogUseCase,
];

const postsUseCases = [
  EditPostUseCase,
  CreateNewPostUseCase,
  UpdatePostLikeStatusUseCase,
  DeletePostUseCase,
  UpdatePostLikeStatusUseCase,
  BanPostsUseCase,
];

const commentsUseCases = [
  CreateCommentUseCase,
  DeleteCommentUseCase,
  UpdateCommentUseCase,
  UpdateLikeStatusUseCase,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostEntity,
      LikeEntity,
      CommentEntity,
      BlogEntity,
      BlogsBannedUserEntity,
    ]),
    CqrsModule,
    AccountModule,
  ],
  controllers: [
    AuthController,
    SaUsersController,
    BloggerUsersController,
    BlogsController,
    SaBlogsController,
    BloggerBlogsController,
    CommentsController,
    PostsController,
    SecurityController,
  ],

  providers: [
    ...blogsUseCases,
    ...postsUseCases,
    ...commentsUseCases,
    //common
    LikesQueryTypeOrmRepository,
    LikesTypeOrmRepository,

    //blogs
    BlogsTypeOrmRepository,
    BlogsQueryTypeOrmRepository,

    //comments
    CommentsTypeOrmRepository,
    CommentsQueryTypeOrmRepository,

    //posts
    PostsQueryTypeOrmRepository,
    PostsTypeOrmRepository,

    //security
    SecurityService,
    //users
    UsersService,
    UsersQueryTypeormRepository,
    UsersTypeOrmRepository,
  ],
})
export class BlogModule {}
