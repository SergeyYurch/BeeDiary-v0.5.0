import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotificationResult } from '../../../../../common/notification/notificationResult';
import { QueenRepository } from '../queen.repository';

export class QueenDeleteCommand {
  constructor(public id: string) {}
}

@CommandHandler(QueenDeleteCommand)
export class QueenDeleteUseCase implements ICommandHandler<QueenDeleteCommand> {
  constructor(private repository: QueenRepository) {}

  async execute(
    command: QueenDeleteCommand,
  ): Promise<NotificationResult<string>> {
    const notification = new NotificationResult();
    const result = await this.repository.delete(command.id);
    if (!result) {
      notification.addError('Error of deleting');
    }
    return notification;
  }
}
