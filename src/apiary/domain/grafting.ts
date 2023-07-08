import { BaseDomain } from '../../common/decorators/base-domain.class';
import { Queen } from './queen';
import { Colony } from './colony';

//Прививка
export class Grafting extends BaseDomain {
  queen: Queen; //матка
  graftDate: Date;
  moveToStarterDate: Date;
  moveToNursingColonyDate: Date;
  exitQueenDate: Date;
  firstFlybyControlDate: Date;
  secondFlybyControlDate: Date;
  starterColony: Colony; //стартер
  nursingColony: Colony[]; //воспиталка
  queenCellCount: number;
  note: string;
}
