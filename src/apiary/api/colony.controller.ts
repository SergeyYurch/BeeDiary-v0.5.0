import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  BadRequestException,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BaseControllerInterface } from '../../common/interfaces/baseControllerInterface';
import { ColonyViewModel } from '../features/colonies/dto/view/colony.view.model';
import { PaginatorViewModel } from '../../common/dto/view-models/paginator.view.model';
import { CommandBus } from '@nestjs/cqrs';
import { User } from '../../account/features/users/domain/user';
import { PaginatorInputType } from '../../common/dto/input-models/paginator.input.type';
import { CurrentUserModel } from '../../account/decorators/current-user-model.param.decorator';
import { PaginatorParam } from '../../common/decorators/paginator-param.decorator';
import { ColonyCreateDto } from '../features/colonies/dto/input/colony.create.dto';
import { ColonyUpdateDto } from '../features/colonies/dto/input/colony.update.dto';
import { NotificationResult } from '../../common/notification/notificationResult';
import { ColonyCreateCommand } from '../features/colonies/providers/use-cases/colony.create.use-case';
import { ColonyQueryRepository } from '../features/colonies/providers/colony.query.repository';
import { ColonyService } from '../features/colonies/providers/colony.service';
import { ColonyOwnerGuard } from '../features/colonies/guards/colony-owner.guard';
import { ColonyIdGuard } from '../features/colonies/guards/colony-id.guard';
import { ColonyUpdateCommand } from '../features/colonies/providers/use-cases/colony.update.use-case';
import { ColonyDeleteCommand } from '../features/colonies/providers/use-cases/colony.delete.use-case';

@Controller('colonies')
export class ColonyController
  implements
    BaseControllerInterface<ColonyCreateDto, ColonyUpdateDto, ColonyViewModel>
{
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryRepository: ColonyQueryRepository,
    private readonly service: ColonyService,
  ) {}

  @Post()
  async create(
    @Body() createDto: ColonyCreateDto,
    @CurrentUserModel() user: User,
  ): Promise<ColonyViewModel> {
    console.log('[ColonyController]:POST - create colony');
    const notificationRes: NotificationResult = await this.commandBus.execute(
      new ColonyCreateCommand(createDto, user),
    );
    if (notificationRes.hasError()) throw new BadRequestException();
    const id = notificationRes.data;
    const domainModel = await this.queryRepository.getDomainModel(id);
    return this.service.getViewModel(domainModel);
  }

  @Get()
  async findAll(
    @CurrentUserModel() user: User,
    @PaginatorParam() paginatorParams: PaginatorInputType,
  ): Promise<PaginatorViewModel<ColonyViewModel>> {
    return this.queryRepository.getAllDomainModels(paginatorParams, user.id);
  }

  @UseGuards(ColonyOwnerGuard)
  @UseGuards(ColonyIdGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ColonyViewModel> {
    const domainModel = await this.queryRepository.getDomainModel(id);
    if (!domainModel) throw new BadRequestException();
    return this.service.getViewModel(domainModel);
  }

  @UseGuards(ColonyOwnerGuard)
  @UseGuards(ColonyIdGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: ColonyUpdateDto) {
    const notificationRes: NotificationResult = await this.commandBus.execute(
      new ColonyUpdateCommand(updateDto, id),
    );
    if (notificationRes.hasError()) {
      console.error('notificationRes extensions:', notificationRes.extensions);
      throw new BadRequestException();
    }
  }

  @UseGuards(ColonyOwnerGuard)
  @UseGuards(ColonyIdGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const notificationRes: NotificationResult = await this.commandBus.execute(
      new ColonyDeleteCommand(id),
    );
    if (notificationRes.hasError()) throw new BadRequestException();
  }
}
