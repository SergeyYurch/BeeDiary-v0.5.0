import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotificationResult } from '../../../../../common/notification/notificationResult';
import { CreateBreedDto } from '../../dto/input/create-breed.dto';
import { BreedRepository } from '../breed.repository';
import { Breed } from '../../../../domain/breed';

export class CreateBreedCommand {
  constructor(public inputDto: CreateBreedDto) {}
}

@CommandHandler(CreateBreedCommand)
export class CreateBreedUseCase implements ICommandHandler<CreateBreedCommand> {
  constructor(private breedRepository: BreedRepository) {}

  async execute(
    command: CreateBreedCommand,
  ): Promise<NotificationResult<string>> {
    const breed = Breed.create(command.inputDto);
    const result = await this.breedRepository.save(breed);
    const notification = new NotificationResult<string>();
    if (result) {
      notification.addData(result);
    } else {
      notification.addError('Error of creating breed');
    }
    return notification;
  }
}
