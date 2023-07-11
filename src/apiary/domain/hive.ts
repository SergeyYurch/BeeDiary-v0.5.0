import { Frame } from './frame';
import { BaseDomain } from '../../common/decorators/base-domain.class';
import { User } from '../../account/features/users/domain/user';
import { HiveCreateDto } from '../features/hives/dto/input/hive.create.dto';
import { isPositiveInt } from '../../common/helpers/helpers';
import { HiveUpdateDto } from '../features/hives/dto/input/hive.update.dto';

export class Hive extends BaseDomain {
  title: string;
  width: number;
  height: number;
  long: number;
  numberOfFrames: number;
  frameType: Frame | null;
  beekeeper: User;
  constructor() {
    super();
  }
  static create(inputDto: HiveCreateDto, user: User, frame?: Frame) {
    const hive = new Hive();
    hive.beekeeper = user;
    hive.frameType = frame ?? null;
    hive.title = inputDto.title ?? 'noname';
    hive.width = isPositiveInt(inputDto.width) ? inputDto.width : 0;
    hive.height = isPositiveInt(inputDto.height) ? inputDto.height : 0;
    hive.long = isPositiveInt(inputDto.long) ? inputDto.long : 0;
    hive.numberOfFrames = isPositiveInt(inputDto.numberOfFrames)
      ? inputDto.numberOfFrames
      : 0;
    return hive;
  }
  update(updateDto: HiveUpdateDto, frame: Frame) {
    this.frameType = frame;
    this.title = updateDto.title ?? 'noname';
    this.width = isPositiveInt(updateDto.width) ? updateDto.width : 0;
    this.height = isPositiveInt(updateDto.height) ? updateDto.height : 0;
    this.long = isPositiveInt(updateDto.long) ? updateDto.long : 0;
    this.numberOfFrames = isPositiveInt(updateDto.numberOfFrames)
      ? updateDto.numberOfFrames
      : 0;
  }
}
