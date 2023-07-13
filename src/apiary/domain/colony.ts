import { BaseDomain } from '../../common/decorators/base-domain.class';
import { Hive } from './hive';
import { Frame } from './frame';
import { Queen } from './queen';
import { DangerStatusEnum } from '../types/danger-status.enum';
import { ColonyCreateDto } from '../features/colonies/dto/input/colony.create.dto';
import { UpdateColonyDto } from '../../../dist/apiary/features/colonies/dto/input/update-colony.dto';

export class Colony extends BaseDomain {
  number: number;
  hive: Hive;
  nestFrameType: Frame;
  queen: Queen;
  condition: number;
  note: string;
  status: DangerStatusEnum;
  constructor() {
    super();
  }
  static create(
    createDto: ColonyCreateDto,
    hive: Hive,
    frame: Frame,
    queen: Queen,
  ) {
    const colony = new Colony();
    colony.number = createDto.number;
    colony.hive = hive;
    colony.nestFrameType = frame;
    colony.queen = queen;
    colony.condition = createDto.condition;
    colony.note = createDto.note;
    colony.status = createDto.status;
  }
  update(
    updateDto: UpdateColonyDto,
    hive: Hive | null = null,
    frame: Frame | null = null,
    queen: Queen | null = null,
  ) {
    this.number = updateDto.number;
    this.hive = hive;
    this.nestFrameType = frame;
    this.queen = queen;
    this.condition = updateDto.condition;
    this.note = updateDto.note;
    this.status = updateDto.status;
  }
}
