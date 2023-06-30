import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BanUserForBlogDto } from '../../dto/ban-user-for-blog.dto';
import { UsersQueryTypeormRepository } from '../../../../../account/features/users/providers/users.query-typeorm.repository';
import { BlogsTypeOrmRepository } from '../blogs.type-orm.repository';
import { BlogsQueryTypeOrmRepository } from '../blogs.query.type-orm.repository';

export class BloggerBanUserCommand {
  constructor(public banInfo: BanUserForBlogDto) {}
}

@CommandHandler(BloggerBanUserCommand)
export class BloggerBanUserUseCase
  implements ICommandHandler<BloggerBanUserCommand>
{
  constructor(
    private blogsQueryTypeOrmRepository: BlogsQueryTypeOrmRepository,
    private userQueryRepository: UsersQueryTypeormRepository,
    private blogRepository: BlogsTypeOrmRepository,
  ) {} // private userQueryRepository: UsersQueryTypeormRepository, // private blogRepository: BlogsTypeOrmRepository, // private blogsQueryTypeOrmRepository: BlogsQueryTypeOrmRepository,

  async execute(command: BloggerBanUserCommand) {
    const { userId, blogId, banReason, isBanned } = command.banInfo;
    const { login } = await this.userQueryRepository.getUserViewById(userId);

    const editBlog = await this.blogsQueryTypeOrmRepository.getBlogModelById(
      blogId,
    );
    editBlog.banUser(userId, login, banReason, isBanned);
    return !!(await this.blogRepository.save(editBlog));
  }
}
