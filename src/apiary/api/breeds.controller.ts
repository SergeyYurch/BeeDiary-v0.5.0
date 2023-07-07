import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  BadRequestException,
} from '@nestjs/common';
import { BaseControllerInterface } from '../../common/interfaces/baseControllerInterface';
import { PaginatorViewModel } from '../../common/dto/view-models/paginator.view.model';
import { CommandBus } from '@nestjs/cqrs';
import { User } from '../../account/features/users/domain/user';
import { PaginatorInputType } from '../../common/dto/input-models/paginator.input.type';
import { CurrentUserModel } from '../../account/decorators/current-user-model.param.decorator';
import { PaginatorParam } from '../../common/decorators/paginator-param.decorator';
import { CreateBreedDto } from '../features/breeds/dto/input/create-breed.dto';
import { UpdateBreedDto } from '../features/breeds/dto/input/update-breed.dto';
import { BreedViewModel } from '../features/breeds/dto/view-models/breed.view.model';
import { CreateBreedCommand } from '../features/breeds/providers/use-cases/create-breed-use-case';
import { NotificationResult } from '../../common/notification/notificationResult';
import { BreedQueryRepository } from '../features/breeds/providers/breed.query.repository';
import { BreedService } from '../features/breeds/providers/breed.service';
import { UpdateBreedCommand } from '../features/breeds/providers/use-cases/update-breed-use-case';
import { DeleteBreedCommand } from '../features/breeds/providers/use-cases/delete-breed-use-case';

@Controller('breeds')
export class BreedsController
  implements
    BaseControllerInterface<CreateBreedDto, UpdateBreedDto, BreedViewModel>
{
  constructor(
    private readonly commandBus: CommandBus,
    private readonly breedQueryRepository: BreedQueryRepository,
    private readonly breedService: BreedService,
  ) {}
  @Post()
  async create(
    @Body() createBreedDto: CreateBreedDto,
  ): Promise<BreedViewModel> {
    const notificationRes: NotificationResult = await this.commandBus.execute(
      new CreateBreedCommand(createBreedDto),
    );
    if (notificationRes.hasError()) throw new BadRequestException();
    const breadId = notificationRes.data;
    const breed = await this.breedQueryRepository.getBreed(breadId);
    return this.breedService.getViewModel(breed);
  }

  @Get()
  async findAll(
    @CurrentUserModel() user: User,
    @PaginatorParam() paginatorParams: PaginatorInputType,
  ): Promise<PaginatorViewModel<BreedViewModel>> {
    return;
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<BreedViewModel> {
    const breed = await this.breedQueryRepository.getBreed(id);
    if (!breed) throw new BadRequestException();
    return this.breedService.getViewModel(breed);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBreedDto: UpdateBreedDto,
  ) {
    const notificationRes: NotificationResult = await this.commandBus.execute(
      new UpdateBreedCommand(updateBreedDto, id),
    );
    if (notificationRes.hasError()) throw new BadRequestException();
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const notificationRes: NotificationResult = await this.commandBus.execute(
      new DeleteBreedCommand(id),
    );
    if (notificationRes.hasError()) throw new BadRequestException();
  }
}
