import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { BreedQueryRepository } from '../features/breeds/providers/breed.query.repository';

@Injectable()
export class CheckBreedIdGuard implements CanActivate {
  constructor(private breedQueryRepository: BreedQueryRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('CheckBreedIdGuard');
    const request = context.switchToHttp().getRequest();
    const id = request.params.id;
    if (!Number.isInteger(+id)) throw new NotFoundException();
    if (+id < 0) throw new NotFoundException();
    const idIsExist = await this.breedQueryRepository.doesIdExist(id);
    if (!idIsExist) {
      console.log('breed not found, breedId does not exist');
      throw new NotFoundException();
    }
    return true;
  }
}
