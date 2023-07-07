import { QueenViewDto } from '../../../queens/dto/view/queen.view.dto';

export class ColonyViewDto {
  number: number;
  hiveType: string;
  nestFrameType: string; // тип гнездовой рамки
  queen: QueenViewDto;
  condition: number;
  note: string;
}
