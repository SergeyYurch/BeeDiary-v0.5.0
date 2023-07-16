import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ApiaryRepository } from '../apiary.repository';
import { NotificationResult } from '../../../../../common/notification/notificationResult';

export class DeleteApiaryCommand {
  constructor(public apiaryId: number) {}
}

@CommandHandler(DeleteApiaryCommand)
export class ApiaryDeleteUseCase
  implements ICommandHandler<DeleteApiaryCommand>
{
  constructor(private apiaryRepository: ApiaryRepository) {}

  async execute(command: DeleteApiaryCommand) {
    const result = await this.apiaryRepository.delete(command.apiaryId);
    const notificationResult = new NotificationResult();
    if (!result) notificationResult.addError('something wrong');
    return notificationResult;
  }
}
