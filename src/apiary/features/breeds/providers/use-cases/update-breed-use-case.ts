import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotificationResult } from '../../../../../common/notification/notificationResult';
import { BreedRepository } from '../breed.repository';
import { UpdateBreedDto } from '../../dto/input/update-breed.dto';
import { BreedQueryRepository } from '../breed.query.repository';

export class UpdateBreedCommand {
  constructor(public updateBreedDto: UpdateBreedDto, public id: string) {}
}

@CommandHandler(UpdateBreedCommand)
export class UpdateBreedUseCase implements ICommandHandler<UpdateBreedCommand> {
  constructor(
    private readonly breedRepository: BreedRepository,
    private readonly queryRepository: BreedQueryRepository,
  ) {}

  async execute(
    command: UpdateBreedCommand,
  ): Promise<NotificationResult<string>> {
    const { updateBreedDto, id } = command;
    const breed = await this.queryRepository.getDomainModel(id);
    breed.title = updateBreedDto.title;
    const result = await this.breedRepository.save(breed);
    const notification = new NotificationResult<string>();
    if (result) {
      notification.addData(result);
    } else {
      notification.addError('Error of updating breed');
    }
    return notification;
  }
}
