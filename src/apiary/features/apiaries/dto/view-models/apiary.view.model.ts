import { ApiaryType } from '../../../../domain/apiary';
import { BeekeeperViewModel } from './beekeeper.view.model';

export class ApiaryViewModel {
  id: string;
  beekeeper: BeekeeperViewModel;
  type: ApiaryType;
  location: string;
  schema: string | null;
  disbandedAt: string;
  note: string;
}
