import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { ApiaryQueryRepository } from '../features/apiaries/providers/apiary.query.repository';

@Injectable()
export class ApiaryOwnerGuard implements CanActivate {
  constructor(private apiaryQueryRepository: ApiaryQueryRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('ApiaryOwnerGuard');
    const request = context.switchToHttp().getRequest();
    const apiaryId = request.params.id;
    const user = request.user;
    if (!user || !apiaryId) throw new BadRequestException();
    const isOwner = await this.apiaryQueryRepository.isOwner(user.id, apiaryId);
    if (!isOwner) throw new ForbiddenException();
    return true;
  }
}
