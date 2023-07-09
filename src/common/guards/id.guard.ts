import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { BaseQueryRepository } from '../../apiary/features/frames/providers/base.query.repository';

@Injectable()
export class IdGuard<QueryRepositoryT extends BaseQueryRepository>
  implements CanActivate
{
  constructor(private queryRepository: QueryRepositoryT) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('IdGuard');
    const request = context.switchToHttp().getRequest();
    const id = request.params.id;
    if (!Number.isInteger(+id)) throw new NotFoundException();
    if (+id < 0) throw new NotFoundException();
    const idIsExist = await this.queryRepository.doesIdExist(id);
    if (!idIsExist) {
      console.log('date not found, id does not exist');
      throw new NotFoundException();
    }
    return true;
  }
}
