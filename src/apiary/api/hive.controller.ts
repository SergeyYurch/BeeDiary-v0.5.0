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
import { PaginatorViewModel } from '../../common/dto/view-models/paginator.view.model';
import { CommandBus } from '@nestjs/cqrs';
import { User } from '../../account/features/users/domain/user';
import { PaginatorInputType } from '../../common/dto/input-models/paginator.input.type';
import { CurrentUserModel } from '../../account/decorators/current-user-model.param.decorator';
import { PaginatorParam } from '../../common/decorators/paginator-param.decorator';
import { NotificationResult } from '../../common/notification/notificationResult';
import { ApiTags } from '@nestjs/swagger';
import { AccessTokenUGuard } from '../../account/guards/access-token-u.guard';
import { HiveCreateDto } from '../features/hives/dto/input/hive.create.dto';
import { HiveUpdateDto } from '../features/hives/dto/input/hive.update.dto';
import { HiveViewModel } from '../features/hives/dto/view/hive.view.model';
import { HiveQueryRepository } from '../features/hives/providers/hive.query.repository';
import { HiveService } from '../features/hives/providers/hive.service';
import { HiveCreateCommand } from '../features/hives/providers/use-cases/hive-create-use-case';
import { HiveOwnerGuard } from '../features/hives/guards/hive-owner.guard';
import { HiveIdGuard } from '../features/hives/guards/hive-id.guard';
import { HiveUpdateCommand } from '../features/hives/providers/use-cases/hive-update-use-case';
import { HiveDeleteCommand } from '../features/hives/providers/use-cases/hive-delete-use-case';

@ApiTags('hives')
@UseGuards(AccessTokenUGuard)
@Controller('hives')
export class HiveController
  implements
    BaseControllerInterface<HiveCreateDto, HiveUpdateDto, HiveViewModel>
{
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryRepository: HiveQueryRepository,
    private readonly service: HiveService,
  ) {}

  @Post()
  async create(
    @Body() createDto: HiveCreateDto,
    @CurrentUserModel() user: User,
  ): Promise<HiveViewModel> {
    console.log('[FramesController]:POST');
    const notificationRes: NotificationResult = await this.commandBus.execute(
      new HiveCreateCommand(createDto, user),
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
  ): Promise<PaginatorViewModel<HiveViewModel>> {
    return this.queryRepository.getAllDomainModels(paginatorParams, user.id);
  }

  @UseGuards(HiveOwnerGuard)
  @UseGuards(HiveIdGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<HiveViewModel> {
    const domainModel = await this.queryRepository.getDomainModel(id);
    if (!domainModel) throw new BadRequestException();
    return this.service.getViewModel(domainModel);
  }

  @UseGuards(HiveOwnerGuard)
  @UseGuards(HiveIdGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: HiveUpdateDto) {
    const notificationRes: NotificationResult = await this.commandBus.execute(
      new HiveUpdateCommand(updateDto, id),
    );
    if (notificationRes.hasError()) throw new BadRequestException();
  }

  @UseGuards(HiveOwnerGuard)
  @UseGuards(HiveIdGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const notificationRes: NotificationResult = await this.commandBus.execute(
      new HiveDeleteCommand(id),
    );
    if (notificationRes.hasError()) throw new BadRequestException();
  }
}
