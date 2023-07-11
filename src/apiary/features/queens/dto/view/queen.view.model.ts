import { Grafting } from '../../../../domain/grafting';

export class QueenViewModel {
  id: string;
  createdAt: string;
  breed: string;
  note: string | null;
  flybyMonth: number | null;
  flybyYear: number | null;
  condition: number | null;
  grafting: Grafting | null;
}
