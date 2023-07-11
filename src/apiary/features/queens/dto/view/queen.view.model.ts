import { Grafting } from '../../../../domain/grafting';
import { BreedViewModel } from '../../../breeds/dto/view/breed.view.model';

export class QueenViewModel {
  id: string;
  createdAt: string;
  breed: BreedViewModel;
  note: string | null;
  flybyMonth: number | null;
  flybyYear: number | null;
  condition: number | null;
  grafting: Grafting | null;
}
