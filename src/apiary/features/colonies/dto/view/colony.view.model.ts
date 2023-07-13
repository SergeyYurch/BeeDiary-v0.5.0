import { QueenViewModel } from '../../../queens/dto/view/queen.view.model';
import { HiveViewModel } from '../../../hives/dto/view/hive.view.model';
import { FrameViewModel } from '../../../frames/dto/view/frame.view.model';

export class ColonyViewModel {
  id: string;
  createdAt: string;
  number: number;
  hive: HiveViewModel;
  nestFrameType: FrameViewModel; // тип гнездовой рамки
  queen: QueenViewModel;
  condition: number;
  note: string;
  status: number;
}
