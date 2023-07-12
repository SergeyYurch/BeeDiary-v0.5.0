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
import { QueenCreateDto } from '../features/queens/dto/input/queen.create.dto';
import { QueenUpdateDto } from '../features/queens/dto/input/queen.update.dto';
import { QueenViewModel } from '../features/queens/dto/view/queen.view.model';
import { QueenQueryRepository } from '../features/queens/providers/queen.query.repository';
import { QueenService } from '../features/queens/providers/queen.service';
import { QueenCreateCommand } from '../features/queens/providers/use-cases/queen.create.use-case';
import { QueenOwnerGuard } from '../features/queens/guards/queen-owner.guard';
import { QueenIdGuard } from '../features/queens/guards/queen-id.guard';
import { QueenUpdateCommand } from '../features/queens/providers/use-cases/queen.update.use-case';
import { QueenDeleteCommand } from '../features/queens/providers/use-cases/queen.delete.use-case';

@ApiTags('queens')
@UseGuards(AccessTokenUGuard)
@Controller('queens')
export class QueensController
  implements
    BaseControllerInterface<QueenCreateDto, QueenUpdateDto, QueenViewModel>
{
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryRepository: QueenQueryRepository,
    private readonly service: QueenService,
  ) {}

  @Post()
  async create(
    @Body() createDto: QueenCreateDto,
    @CurrentUserModel() user: User,
  ): Promise<QueenViewModel> {
    console.log('[QueensController]:POST - create queen');
    const notificationRes: NotificationResult = await this.commandBus.execute(
      new QueenCreateCommand(createDto, user),
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
  ): Promise<PaginatorViewModel<QueenViewModel>> {
    return this.queryRepository.getAllDomainModels(paginatorParams, user.id);
  }

  @UseGuards(QueenOwnerGuard)
  @UseGuards(QueenIdGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<QueenViewModel> {
    const domainModel = await this.queryRepository.getDomainModel(id);
    if (!domainModel) throw new BadRequestException();
    return this.service.getViewModel(domainModel);
  }

  @UseGuards(QueenOwnerGuard)
  @UseGuards(QueenIdGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: QueenUpdateDto) {
    const notificationRes: NotificationResult = await this.commandBus.execute(
      new QueenUpdateCommand(updateDto, id),
    );
    if (notificationRes.hasError()) {
      console.error('notificationRes extensions:', notificationRes.extensions);
      throw new BadRequestException();
    }
  }

  @UseGuards(QueenOwnerGuard)
  @UseGuards(QueenIdGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const notificationRes: NotificationResult = await this.commandBus.execute(
      new QueenDeleteCommand(id),
    );
    if (notificationRes.hasError()) throw new BadRequestException();
  }
}
