import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotificationResult } from '../../../../../common/notification/notificationResult';
import { User } from '../../../../../account/features/users/domain/user';
import { ColonyCreateDto } from '../../dto/input/colony.create.dto';
import { ColonyRepository } from '../colony.repository';
import { Queen } from '../../../../domain/queen';
import { Hive } from '../../../../domain/hive';
import { Frame } from '../../../../domain/frame';
import { FrameQueryRepository } from '../../../frames/providers/frame.query.repository';
import { QueenQueryRepository } from '../../../queens/providers/queen.query.repository';
import { HiveQueryRepository } from '../../../hives/providers/hive.query.repository';
import { Colony } from '../../../../domain/colony';

export class ColonyCreateCommand {
  constructor(public inputDto: ColonyCreateDto, public user: User) {}
}

@CommandHandler(ColonyCreateCommand)
export class ColonyCreateUseCase
  implements ICommandHandler<ColonyCreateCommand>
{
  constructor(
    private repository: ColonyRepository,
    private readonly hiveQueryRepository: HiveQueryRepository,
    private readonly frameQueryRepository: FrameQueryRepository,
    private readonly queenQueryRepository: QueenQueryRepository,
  ) {}

  async execute(
    command: ColonyCreateCommand,
  ): Promise<NotificationResult<string>> {
    let hiveDomainModel: Hive | null = null;
    let frameDomainModel: Frame | null = null;
    let queenDomainModel: Queen | null = null;
    if (command.inputDto.hiveTypeId)
      hiveDomainModel = await this.hiveQueryRepository.getDomainModel(
        command.inputDto.hiveTypeId,
      );
    if (command.inputDto.nestsFrameTypeId)
      frameDomainModel = await this.frameQueryRepository.getDomainModel(
        command.inputDto.nestsFrameTypeId,
      );
    if (command.inputDto.queenId)
      queenDomainModel = await this.queenQueryRepository.getDomainModel(
        command.inputDto.queenId,
      );
    const colony = Colony.create(
      command.inputDto,
      hiveDomainModel,
      frameDomainModel,
      queenDomainModel,
      command.user,
    );
    console.log('colony', colony);
    const result = await this.repository.save(colony);
    const notification = new NotificationResult<string>();
    if (result) {
      notification.addData(result);
    } else {
      notification.addError('Error of creating breed');
    }
    return notification;
  }
}
