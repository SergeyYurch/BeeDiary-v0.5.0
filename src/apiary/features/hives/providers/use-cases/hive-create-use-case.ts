import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotificationResult } from '../../../../../common/notification/notificationResult';
import { User } from '../../../../../account/features/users/domain/user';
import { HiveCreateDto } from '../../dto/input/hive.create.dto';
import { HiveRepository } from '../hive.repository';
import { Hive } from '../../../../domain/hive';
import { FrameQueryRepository } from '../../../frames/providers/frame.query.repository';

export class HiveCreateCommand {
  constructor(public inputDto: HiveCreateDto, public user: User) {}
}

@CommandHandler(HiveCreateCommand)
export class HiveCreateUseCase implements ICommandHandler<HiveCreateCommand> {
  constructor(
    private hiveRepository: HiveRepository,
    private readonly frameQueryRepository: FrameQueryRepository,
  ) {}

  async execute(
    command: HiveCreateCommand,
  ): Promise<NotificationResult<string>> {
    const frame = await this.frameQueryRepository.getDomainModel(
      command.inputDto.frameTypeId,
    );
    const hive = Hive.create(command.inputDto, command.user, frame);
    const result = await this.hiveRepository.save(hive);
    const notification = new NotificationResult<string>();
    if (result) {
      notification.addData(result);
    } else {
      notification.addError('Error of creating breed');
    }
    return notification;
  }
}
