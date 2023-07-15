import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotificationResult } from '../../../../../common/notification/notificationResult';
import { ColonyUpdateDto } from '../../dto/input/colony.update.dto';
import { ColonyRepository } from '../colony.repository';
import { ColonyQueryRepository } from '../colony.query.repository';
import { HiveQueryRepository } from '../../../hives/providers/hive.query.repository';
import { FrameQueryRepository } from '../../../frames/providers/frame.query.repository';
import { QueenQueryRepository } from '../../../queens/providers/queen.query.repository';
import { Frame } from '../../../../domain/frame';
import { Hive } from '../../../../domain/hive';
import { Queen } from '../../../../domain/queen';

export class ColonyUpdateCommand {
  constructor(public updateDto: ColonyUpdateDto, public id: string) {}
}

@CommandHandler(ColonyUpdateCommand)
export class ColonyUpdateUseCase
  implements ICommandHandler<ColonyUpdateCommand>
{
  constructor(
    private repository: ColonyRepository,
    private queryRepository: ColonyQueryRepository,
    private readonly hiveQueryRepository: HiveQueryRepository,
    private readonly frameQueryRepository: FrameQueryRepository,
    private readonly queenQueryRepository: QueenQueryRepository,
  ) {}

  async execute(
    command: ColonyUpdateCommand,
  ): Promise<NotificationResult<string>> {
    const notification = new NotificationResult<string>();
    const { updateDto, id } = command;
    const colony = await this.queryRepository.getDomainModel(id);
    if (!colony) {
      notification.addError('Hive did not found');
      return notification;
    }

    let hiveDomainModel: Hive | null = null;
    let frameDomainModel: Frame | null = null;
    let queenDomainModel: Queen | null = null;
    if (updateDto.hiveTypeId)
      hiveDomainModel = await this.hiveQueryRepository.getDomainModel(
        updateDto.hiveTypeId,
      );
    if (updateDto.nestsFrameTypeId)
      frameDomainModel = await this.frameQueryRepository.getDomainModel(
        updateDto.nestsFrameTypeId,
      );
    if (updateDto.queenId)
      queenDomainModel = await this.queenQueryRepository.getDomainModel(
        updateDto.queenId,
      );

    colony.update(
      updateDto,
      hiveDomainModel,
      frameDomainModel,
      queenDomainModel,
    );
    const result = await this.repository.save(colony);
    if (result) {
      notification.addData(result);
    } else {
      notification.addError('Error of creating product');
    }
    return notification;
  }
}
