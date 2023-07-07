import { CreateBreedDto } from '../features/breeds/dto/input/create-breed.dto';

export class Breed {
  id: string;
  title: string;

  static create(inputDto: CreateBreedDto): Breed {
    const domainModel = new Breed();
    domainModel.title = inputDto.title;
    return domainModel;
  }
}
