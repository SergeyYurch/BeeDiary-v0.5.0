import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { BreedQueryRepository } from '../features/breeds/providers/breed.query.repository';

@Injectable()
export class BreedOwnerGuard implements CanActivate {
  constructor(private breedQueryRepository: BreedQueryRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('BreedOwnerGuard');
    const request = context.switchToHttp().getRequest();
    const id = request.params.id;
    const user = request.user;
    if (!user || !id) throw new BadRequestException();
    const isOwner = await this.breedQueryRepository.isOwner(user.id, id);
    if (!isOwner) throw new ForbiddenException();
    return true;
  }
}
