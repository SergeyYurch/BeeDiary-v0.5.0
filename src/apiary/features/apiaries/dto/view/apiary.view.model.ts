import { ApiaryType } from '../../../../domain/apiary';
import { BeekeeperViewModel } from './beekeeper.view.model';
import { ApiProperty } from '@nestjs/swagger';

export class ApiaryViewModel {
  @ApiProperty()
  id: string;
  @ApiProperty()
  beekeeper: BeekeeperViewModel;
  @ApiProperty()
  type: ApiaryType;
  @ApiProperty()
  location: string;
  @ApiProperty()
  schema: string | null;
  @ApiProperty()
  disbandedAt: string;
  @ApiProperty()
  note: string;
}
