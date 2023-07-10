import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotificationResult } from '../../../../../common/notification/notificationResult';
import { HiveRepository } from '../hive.repository';

export class HiveDeleteCommand {
  constructor(public id: string) {}
}

@CommandHandler(HiveDeleteCommand)
export class HiveDeleteUseCase implements ICommandHandler<HiveDeleteCommand> {
  constructor(private repository: HiveRepository) {}

  async execute(
    command: HiveDeleteCommand,
  ): Promise<NotificationResult<string>> {
    const notification = new NotificationResult();
    const result = await this.repository.delete(command.id);
    if (!result) {
      notification.addError('Error of creating breed');
    }
    return notification;
  }
}
