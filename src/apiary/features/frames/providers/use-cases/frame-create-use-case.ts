import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotificationResult } from '../../../../../common/notification/notificationResult';
import { User } from '../../../../../account/features/users/domain/user';
import { FrameCreateDto } from '../../dto/input/frame-create.dto';
import { FrameRepository } from '../frame.repository';
import { Frame } from '../../../../domain/frame';

export class FrameCreateCommand {
  constructor(public inputDto: FrameCreateDto, public user: User) {}
}

@CommandHandler(FrameCreateCommand)
export class FrameCreateUseCase implements ICommandHandler<FrameCreateCommand> {
  constructor(private frameRepository: FrameRepository) {}

  async execute(
    command: FrameCreateCommand,
  ): Promise<NotificationResult<string>> {
    const frame = Frame.create(command.inputDto, command.user);
    const result = await this.frameRepository.save(frame);
    const notification = new NotificationResult<string>();
    if (result) {
      notification.addData(result);
    } else {
      notification.addError('Error of creating breed');
    }
    return notification;
  }
}
