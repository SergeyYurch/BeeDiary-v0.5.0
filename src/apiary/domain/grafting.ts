import { BaseDomain } from '../../common/decorators/base-domain.class';
import { Queen } from './queen';
import { Colony } from './colony';

//Прививка
export class Grafting extends BaseDomain {
  queen: Queen; //матка
  graftDate: Date; // дата прививки
  starterColony: Colony | null; //стартер
  nursingColony: Colony[]; //воспиталка
  queenCellCount: number; // количество маточников
  note: string;
}
