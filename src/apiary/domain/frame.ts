import { BaseDomain } from '../../common/decorators/base-domain.class';
import { FrameCreateDto } from '../features/frames/dto/input/frame-create.dto';
import { FrameUpdateDto } from '../features/frames/dto/input/frame-update.dto';
import { User } from '../../account/features/users/domain/user';

export class Frame extends BaseDomain {
  type: string;
  width: number;
  height: number;
  numberOfCells: number;
  beekeeper: User;
  constructor() {
    super();
  }
  static create(inputDto: FrameCreateDto, user: User) {
    const frame = new Frame();
    frame.beekeeper = user;
    frame.type = inputDto.type ?? 'unknown';

    if (
      inputDto.width &&
      Number.isInteger(inputDto.width) &&
      inputDto.width > 0
    ) {
      frame.width = inputDto.width;
    } else {
      frame.width = 0;
    }

    if (
      inputDto.height &&
      Number.isInteger(inputDto.height) &&
      inputDto.height > 0
    ) {
      frame.height = inputDto.height;
    } else {
      frame.height = 0;
    }

    if (
      inputDto.numberOfCells &&
      Number.isInteger(inputDto.numberOfCells) &&
      inputDto.numberOfCells > 0
    ) {
      frame.numberOfCells = inputDto.numberOfCells;
    } else {
      frame.numberOfCells = 0;
    }
    return frame;
  }

  update(updateDto: FrameUpdateDto) {
    this.type = updateDto.type ?? 'unknown';

    if (
      updateDto.width &&
      Number.isInteger(updateDto.width) &&
      updateDto.width > 0
    ) {
      this.width = updateDto.width;
    } else {
      this.width = 0;
    }

    if (
      updateDto.height &&
      Number.isInteger(updateDto.height) &&
      updateDto.height > 0
    ) {
      this.height = updateDto.height;
    } else {
      this.height = 0;
    }

    if (
      updateDto.numberOfCells &&
      Number.isInteger(updateDto.numberOfCells) &&
      updateDto.numberOfCells > 0
    ) {
      this.numberOfCells = updateDto.numberOfCells;
    } else {
      this.numberOfCells = 0;
    }
  }
}
