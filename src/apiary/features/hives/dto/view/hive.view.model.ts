import { FrameViewModel } from '../../../frames/dto/view/frame.view.model';

export class HiveViewModel {
  id: string;
  createdAt: string;
  title: string;
  width: number;
  height: number;
  long: number;
  numberOfFrames: number;
  frameType: FrameViewModel;
}
