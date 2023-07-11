import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotificationResult } from '../../../../../common/notification/notificationResult';
import { HiveUpdateDto } from '../../dto/input/hive.update.dto';
import { HiveRepository } from '../hive.repository';
import { HiveQueryRepository } from '../hive.query.repository';
import { FrameQueryRepository } from '../../../frames/providers/frame.query.repository';
import { Frame } from '../../../../domain/frame';

export class HiveUpdateCommand {
  constructor(public updateDto: HiveUpdateDto, public id: string) {}
}

@CommandHandler(HiveUpdateCommand)
export class HiveUpdateUseCase implements ICommandHandler<HiveUpdateCommand> {
  constructor(
    private repository: HiveRepository,
    private queryRepository: HiveQueryRepository,
    private readonly frameQueryRepository: FrameQueryRepository,
  ) {}

  async execute(
    command: HiveUpdateCommand,
  ): Promise<NotificationResult<string>> {
    const notification = new NotificationResult<string>();
    const { updateDto, id } = command;
    const hive = await this.queryRepository.getDomainModel(id);
    if (!hive) {
      notification.addError('Hive did not found');
      return notification;
    }

    let frame: null | Frame = null;
    if (updateDto.frameTypeId)
      frame = await this.frameQueryRepository.getDomainModel(
        updateDto.frameTypeId,
      );
    hive.update(updateDto, frame);
    const result = await this.repository.save(hive);
    if (result) {
      notification.addData(result);
    } else {
      notification.addError('Error of creating breed');
    }
    return notification;
  }
}
