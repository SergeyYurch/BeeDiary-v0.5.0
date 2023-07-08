import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotificationResult } from '../../../../../common/notification/notificationResult';
import { FrameRepository } from '../frame.repository';

export class FrameDeleteCommand {
  constructor(public id: string) {}
}

@CommandHandler(FrameDeleteCommand)
export class FrameDeleteUseCase implements ICommandHandler<FrameDeleteCommand> {
  constructor(private frameRepository: FrameRepository) {}

  async execute(
    command: FrameDeleteCommand,
  ): Promise<NotificationResult<string>> {
    const notification = new NotificationResult();
    const result = await this.frameRepository.delete(command.id);
    if (!result) {
      notification.addError('Error of creating breed');
    }
    return notification;
  }
}
