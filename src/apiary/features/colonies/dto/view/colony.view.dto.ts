import { QueenViewModel } from '../../../queens/dto/view/queen.view.model';

export class ColonyViewDto {
  number: number;
  hiveType: string;
  nestFrameType: string; // тип гнездовой рамки
  queen: QueenViewModel;
  condition: number;
  note: string;
}
