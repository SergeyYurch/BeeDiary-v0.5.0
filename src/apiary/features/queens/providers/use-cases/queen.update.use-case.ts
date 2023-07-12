import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotificationResult } from '../../../../../common/notification/notificationResult';
import { QueenUpdateDto } from '../../dto/input/queen.update.dto';
import { QueenRepository } from '../queen.repository';
import { QueenQueryRepository } from '../queen.query.repository';
import { BreedQueryRepository } from '../../../breeds/providers/breed.query.repository';
import { Breed } from '../../../../domain/breed';

export class QueenUpdateCommand {
  constructor(public updateDto: QueenUpdateDto, public id: string) {}
}

@CommandHandler(QueenUpdateCommand)
export class QueenUpdateUseCase implements ICommandHandler<QueenUpdateCommand> {
  constructor(
    private repository: QueenRepository,
    private queryRepository: QueenQueryRepository,
    private readonly breedQueryRepository: BreedQueryRepository,
  ) {}

  async execute(
    command: QueenUpdateCommand,
  ): Promise<NotificationResult<string>> {
    const notification = new NotificationResult<string>();
    const { updateDto, id } = command;
    const queen = await this.queryRepository.getDomainModel(id);
    if (!queen) {
      notification.addError('Hive did not found');
      return notification;
    }

    let breed: null | Breed = null;
    if (updateDto.breedId)
      breed = await this.breedQueryRepository.getDomainModel(updateDto.breedId);
    queen.update(updateDto, breed);
    const result = await this.repository.save(queen);
    if (result) {
      notification.addData(result);
    } else {
      notification.addError('Error of creating product');
    }
    return notification;
  }
}
