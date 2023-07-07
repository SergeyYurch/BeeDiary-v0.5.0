import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotificationResult } from '../../../../../common/notification/notificationResult';
import { BreedRepository } from '../breed.repository';

export class DeleteBreedCommand {
  constructor(public id: string) {}
}

@CommandHandler(DeleteBreedCommand)
export class DeleteBreedUseCase implements ICommandHandler<DeleteBreedCommand> {
  constructor(private readonly breedRepository: BreedRepository) {}

  async execute(
    command: DeleteBreedCommand,
  ): Promise<NotificationResult<string>> {
    const result = await this.breedRepository.delete(command.id);
    const notification = new NotificationResult<string>();
    if (result) {
      notification.addData(`breed id: ${command.id} was deleted`);
    } else {
      notification.addError('Error of updating breed');
    }
    return notification;
  }
}
