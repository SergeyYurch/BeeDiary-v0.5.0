import { CreateBreedDto } from '../features/breeds/dto/input/create-breed.dto';
import { User } from '../../account/features/users/domain/user';
import { BaseDomain } from '../../common/decorators/base-domain.class';

export class Breed extends BaseDomain {
  title: string;
  beekeeper: User;
  constructor() {
    super();
  }
  static create(inputDto: CreateBreedDto, user: User): Breed {
    const domainModel = new Breed();
    domainModel.createdAt = new Date();
    domainModel.title = inputDto.title;
    domainModel.beekeeper = user;
    return domainModel;
  }
}
