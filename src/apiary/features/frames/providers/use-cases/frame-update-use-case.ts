import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotificationResult } from '../../../../../common/notification/notificationResult';
import { FrameCreateDto } from '../../dto/input/frame-create.dto';
import { FrameRepository } from '../frame.repository';
import { FrameQueryRepository } from '../frame.query.repository';

export class FrameUpdateCommand {
  constructor(public updateDto: FrameCreateDto, public id: string) {}
}

@CommandHandler(FrameUpdateCommand)
export class FrameUpdateUseCase implements ICommandHandler<FrameUpdateCommand> {
  constructor(
    private frameRepository: FrameRepository,
    private frameQueryRepository: FrameQueryRepository,
  ) {}

  async execute(
    command: FrameUpdateCommand,
  ): Promise<NotificationResult<string>> {
    const notification = new NotificationResult<string>();
    const { updateDto, id } = command;
    const frame = await this.frameQueryRepository.getDomainModel(id);
    if (!frame) {
      notification.addError('Frame did not found');
      return notification;
    }
    frame.update(updateDto);
    const result = await this.frameRepository.save(frame);
    if (result) {
      notification.addData(result);
    } else {
      notification.addError('Error of creating breed');
    }
    return notification;
  }
}
