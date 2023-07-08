import { BaseDomain } from '../../common/decorators/base-domain.class';

export class Frame extends BaseDomain {
  type: string;
  width: number;
  height: number;
  cellsNumber: number;
  constructor() {
    super();
  }
}
