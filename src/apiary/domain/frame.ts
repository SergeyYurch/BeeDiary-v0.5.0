import { BaseDomain } from '../../common/decorators/base-domain.class';
import { FrameCreateDto } from '../features/frames/dto/input/frame-create.dto';
import { FrameUpdateDto } from '../features/frames/dto/input/frame-update.dto';

export class Frame extends BaseDomain {
  type: string;
  width: number;
  height: number;
  cellsNumber: number;
  constructor() {
    super();
  }
  static create(inputDto: FrameCreateDto) {
    const frame = new Frame();
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
      inputDto.cellsNumber &&
      Number.isInteger(inputDto.cellsNumber) &&
      inputDto.cellsNumber > 0
    ) {
      frame.cellsNumber = inputDto.cellsNumber;
    } else {
      frame.cellsNumber = 0;
    }
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
      updateDto.cellsNumber &&
      Number.isInteger(updateDto.cellsNumber) &&
      updateDto.cellsNumber > 0
    ) {
      this.cellsNumber = updateDto.cellsNumber;
    } else {
      this.cellsNumber = 0;
    }
  }
}
