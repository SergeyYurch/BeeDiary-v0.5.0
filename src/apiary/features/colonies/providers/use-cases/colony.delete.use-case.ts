import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotificationResult } from '../../../../../common/notification/notificationResult';
import { ColonyRepository } from '../colony.repository';

export class ColonyDeleteCommand {
  constructor(public id: string) {}
}

@CommandHandler(ColonyDeleteCommand)
export class ColonyDeleteUseCase
  implements ICommandHandler<ColonyDeleteCommand>
{
  constructor(private repository: ColonyRepository) {}

  async execute(
    command: ColonyDeleteCommand,
  ): Promise<NotificationResult<string>> {
    const notification = new NotificationResult();
    const result = await this.repository.delete(command.id);
    if (!result) {
      notification.addError('Error of deleting');
    }
    return notification;
  }
}
