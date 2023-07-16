import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ApiaryRepository } from '../apiary.repository';
import { ApiaryUpdateDto } from '../../dto/input/apiary.update.dto';
import { ApiaryQueryRepository } from '../apiary.query.repository';
import { NotificationResult } from '../../../../../common/notification/notificationResult';

export class UpdateApiaryCommand {
  constructor(public apiaryId: number, public updateDto: ApiaryUpdateDto) {}
}

@CommandHandler(UpdateApiaryCommand)
export class ApiaryUpdateUseCase
  implements ICommandHandler<UpdateApiaryCommand>
{
  constructor(
    private apiaryRepository: ApiaryRepository,
    private readonly apiaryQueryRepository: ApiaryQueryRepository,
  ) {}

  async execute(command: UpdateApiaryCommand) {
    const { apiaryId, updateDto } = command;
    const apiary = await this.apiaryQueryRepository.getApiary(apiaryId);
    apiary.type = updateDto.type;
    apiary.location = updateDto.location;
    apiary.disbandedAt = updateDto.disbandedAt;
    apiary.note = updateDto.note;
    const result = await this.apiaryRepository.save(apiary);
    const notificationResult = new NotificationResult();
    if (!result) notificationResult.addError('something wrong');
    return notificationResult;
  }
}
