import { Injectable } from '@nestjs/common';
import { Breed } from '../../../domain/breed';
import { BreedViewModel } from '../dto/view/breed.view.model';

@Injectable()
export class BreedService {
  getViewModel(breed: Breed): BreedViewModel {
    return {
      id: breed.id,
      title: breed.title,
    };
  }
}
