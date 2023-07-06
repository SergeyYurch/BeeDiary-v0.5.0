import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { ApiaryQueryRepository } from '../features/apiaries/providers/apiary.query.repository';

@Injectable()
export class CheckApiaryIdGuard implements CanActivate {
  constructor(private apiaryQueryRepository: ApiaryQueryRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('CheckApiaryIdGuard');
    const request = context.switchToHttp().getRequest();
    const apiaryId = request.params.id;
    if (!Number.isInteger(+apiaryId)) throw new NotFoundException();
    if (+apiaryId < 0) throw new NotFoundException();
    const apiaryIdIsExist = await this.apiaryQueryRepository.doesApiaryIdExist(
      apiaryId,
    );
    if (!apiaryIdIsExist) {
      console.log('apiary not found, apiaryId does not exist');
      throw new NotFoundException();
    }
    return true;
  }
}
