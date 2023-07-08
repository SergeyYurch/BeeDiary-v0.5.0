import { Frame } from './frame';
import { BaseDomain } from '../../common/decorators/base-domain.class';

export class Hive extends BaseDomain {
  id: number;
  type: string;
  frameNumber: number;
  frame: Frame;
  width: number;
  long: number;
  height: number;
  constructor() {
    super();
  }
  static create();
}
