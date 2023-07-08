import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { BaseQueryRepository } from '../../apiary/features/frames/providers/base.query.repository';

@Injectable()
export class OwnerGuard<QueryRepositoryT extends BaseQueryRepository>
  implements CanActivate
{
  constructor(private queryRepository: QueryRepositoryT) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('BreedOwnerGuard');
    const request = context.switchToHttp().getRequest();
    const id = request.params.id;
    const user = request.user;
    if (!user || !id) throw new BadRequestException();
    const isOwner = await this.queryRepository.isOwner(user.id, id);
    if (!isOwner) throw new ForbiddenException();
    return true;
  }
}
