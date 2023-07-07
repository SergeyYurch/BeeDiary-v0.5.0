import { CreateBreedDto } from '../features/breeds/dto/input/create-breed.dto';
import { User } from '../../account/features/users/domain/user';

export class Breed {
  id: string;
  title: string;
  beekeeper: User;

  static create(inputDto: CreateBreedDto, user: User): Breed {
    const domainModel = new Breed();
    domainModel.title = inputDto.title;
    domainModel.beekeeper = user;
    return domainModel;
  }
}
