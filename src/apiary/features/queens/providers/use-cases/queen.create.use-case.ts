import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotificationResult } from '../../../../../common/notification/notificationResult';
import { User } from '../../../../../account/features/users/domain/user';
import { QueenCreateDto } from '../../dto/input/queen.create.dto';
import { QueenRepository } from '../queen.repository';
import { Queen } from '../../../../domain/queen';
import { BreedQueryRepository } from '../../../breeds/providers/breed.query.repository';
import { Breed } from '../../../../domain/breed';

export class QueenCreateCommand {
  constructor(public inputDto: QueenCreateDto, public user: User) {}
}

@CommandHandler(QueenCreateCommand)
export class QueenCreateUseCase implements ICommandHandler<QueenCreateCommand> {
  constructor(
    private repository: QueenRepository,
    private readonly breedQueryRepository: BreedQueryRepository,
  ) {}

  async execute(
    command: QueenCreateCommand,
  ): Promise<NotificationResult<string>> {
    let breedDomainModel: null | Breed = null;
    if (command.inputDto.breedId)
      breedDomainModel = await this.breedQueryRepository.getDomainModel(
        command.inputDto.breedId,
      );

    const queen = Queen.create(
      command.inputDto,
      command.user,
      breedDomainModel,
    );
    const result = await this.repository.save(queen);
    const notification = new NotificationResult<string>();
    if (result) {
      notification.addData(result);
    } else {
      notification.addError('Error of creating breed');
    }
    return notification;
  }
}
