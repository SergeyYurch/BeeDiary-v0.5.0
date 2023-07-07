import { Injectable } from '@nestjs/common';
import { Breed } from '../../../domain/breed';
import { BreedViewModel } from '../dto/view-models/breed.view.model';

@Injectable()
export class BreedService {
  getViewModel(breed: Breed): BreedViewModel {
    return {
      title: breed.title,
    };
  }
}
