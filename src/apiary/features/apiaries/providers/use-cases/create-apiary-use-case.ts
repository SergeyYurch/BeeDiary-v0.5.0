import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateApiaryDto } from '../../dto/input/create-apiary.dto';
import { ApiaryRepository } from '../apiary.repository';
import { Apiary } from '../../../../domain/apiary';
import { User } from '../../../../../account/features/users/domain/user';
import { NotificationResult } from '../../../../../common/notification/notificationResult';

export class CreateApiaryCommand {
  constructor(public inputDto: CreateApiaryDto, public user: User) {}
}

@CommandHandler(CreateApiaryCommand)
export class CreateApiaryUseCase
  implements ICommandHandler<CreateApiaryCommand>
{
  constructor(private apiaryRepository: ApiaryRepository) {}

  async execute(
    command: CreateApiaryCommand,
  ): Promise<NotificationResult<string>> {
    const { inputDto, user } = command;
    const apiary = Apiary.create(inputDto, user);
    const result = await this.apiaryRepository.save(apiary);
    const notification = new NotificationResult<string>();
    if (result) {
      notification.addData(result);
    } else {
      notification.addError('Error of creating apiary');
    }
    return notification;
  }
}
