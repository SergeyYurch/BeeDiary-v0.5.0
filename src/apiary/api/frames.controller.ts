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
import { FrameCreateDto } from '../features/frames/dto/input/frame-create.dto';
import { FrameUpdateDto } from '../features/frames/dto/input/frame-update.dto';
import { FrameViewModel } from '../features/frames/dto/view/frame.view.model';
import { FrameCreateCommand } from '../features/frames/providers/use-cases/frame-create-use-case';
import { FrameQueryRepository } from '../features/frames/providers/frame.query.repository';
import { FrameService } from '../features/frames/providers/frame.service';
import { FrameUpdateCommand } from '../features/frames/providers/use-cases/frame-update-use-case';
import { FrameDeleteCommand } from '../features/frames/providers/use-cases/frame-delete-use-case';
import { FrameOwnerGuard } from '../features/frames/guards/frame-owner.guard';
import { CheckFrameIdGuard } from '../features/frames/guards/check-frame-id.guard';

@ApiTags('frames')
@UseGuards(AccessTokenUGuard)
@Controller('frames')
export class FramesController
  implements
    BaseControllerInterface<FrameCreateDto, FrameUpdateDto, FrameViewModel>
{
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryRepository: FrameQueryRepository,
    private readonly service: FrameService,
  ) {}

  @Post()
  async create(
    @Body() createDto: FrameCreateDto,
    @CurrentUserModel() user: User,
  ): Promise<FrameViewModel> {
    const notificationRes: NotificationResult = await this.commandBus.execute(
      new FrameCreateCommand(createDto, user),
    );
    if (notificationRes.hasError()) throw new BadRequestException();
    const id = notificationRes.data;
    const domainModel = await this.queryRepository.getDomainModel(id);
    return this.service.getViewModel(domainModel);
  }

  @UseGuards(FrameOwnerGuard)
  @Get()
  async findAll(
    @CurrentUserModel() user: User,
    @PaginatorParam() paginatorParams: PaginatorInputType,
  ): Promise<PaginatorViewModel<FrameViewModel>> {
    return;
  }

  @UseGuards(FrameOwnerGuard)
  @UseGuards(CheckFrameIdGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<FrameViewModel> {
    const domainModel = await this.queryRepository.getDomainModel(id);
    if (!domainModel) throw new BadRequestException();
    return this.service.getViewModel(domainModel);
  }

  @UseGuards(FrameOwnerGuard)
  @UseGuards(CheckFrameIdGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: FrameUpdateDto) {
    const notificationRes: NotificationResult = await this.commandBus.execute(
      new FrameUpdateCommand(updateDto, id),
    );
    if (notificationRes.hasError()) throw new BadRequestException();
  }

  @UseGuards(FrameOwnerGuard)
  @UseGuards(CheckFrameIdGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const notificationRes: NotificationResult = await this.commandBus.execute(
      new FrameDeleteCommand(id),
    );
    if (notificationRes.hasError()) throw new BadRequestException();
  }
}
