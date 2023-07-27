import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiaryCreateDto } from '../features/apiaries/dto/input/apiary.create.dto';
import { ApiaryUpdateDto } from '../features/apiaries/dto/input/apiary.update.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import { CreateApiaryCommand } from '../features/apiaries/providers/use-cases/apiary.create.use-case';
import { AccessTokenUGuard } from '../../account/guards/access-token-u.guard';
import { User } from '../../account/features/users/domain/user';
import { ApiaryQueryRepository } from '../features/apiaries/providers/apiary.query.repository';
import { CurrentUserModel } from '../../account/decorators/current-user-model.param.decorator';
import { PaginatorParam } from '../../common/decorators/paginator-param.decorator';
import { PaginatorInputType } from '../../common/dto/input-models/paginator.input.type';
import { UpdateApiaryCommand } from '../features/apiaries/providers/use-cases/apiary.update.use-case';
import { CheckApiaryIdGuard } from '../guards/check-apiary-id.guard';
import { DeleteApiaryCommand } from '../features/apiaries/providers/use-cases/apiary.delete.use-case';
import { NotificationResult } from '../../common/notification/notificationResult';
import { ApiaryViewModel } from '../features/apiaries/dto/view/apiary.view.model';
import { ApiaryOwnerGuard } from '../guards/apiary-owner.guard';
import { BaseControllerInterface } from '../../common/interfaces/baseControllerInterface';
import { PaginatorViewModel } from '../../common/dto/view-models/paginator.view.model';

@ApiBearerAuth()
@ApiTags('apiary')
@UseGuards(AccessTokenUGuard)
@Controller('apiaries')
export class ApiariesController
  implements
    BaseControllerInterface<ApiaryCreateDto, ApiaryUpdateDto, ApiaryViewModel>
{
  constructor(
    private readonly queryRepository: ApiaryQueryRepository,
    private readonly commandBus: CommandBus,
  ) {}

  @ApiOperation({ summary: 'Create apiary' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({
    status: 201,
    description: 'Apiary was created',
    type: ApiaryViewModel,
  })
  @ApiResponse({
    status: 400,
    description: 'If input data is incorrect',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiBody({ type: ApiaryCreateDto })
  @Post()
  async create(
    @Body() createApiaryDto: ApiaryCreateDto,
    @CurrentUserModel() user: User,
  ): Promise<ApiaryViewModel> {
    const resultOfCreate = await this.commandBus.execute<
      CreateApiaryCommand,
      NotificationResult<string>
    >(new CreateApiaryCommand(createApiaryDto, user));
    if (resultOfCreate.hasError())
      throw new BadRequestException(resultOfCreate);
    const apiaryId = resultOfCreate.data;
    const resultOfView = await this.queryRepository.getApiaryView(apiaryId);
    if (!resultOfView.hasError()) return resultOfView.data;
    throw new BadRequestException(resultOfCreate);
  }

  @Get()
  async findAll(
    @CurrentUserModel() user: User,
    @PaginatorParam() paginatorParams: PaginatorInputType,
  ): Promise<PaginatorViewModel<ApiaryViewModel>> {
    return this.queryRepository.getAllApiaryViews(paginatorParams, +user.id);
  }

  @UseGuards(ApiaryOwnerGuard)
  @UseGuards(CheckApiaryIdGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiaryViewModel> {
    const notification = await this.queryRepository.getApiaryView(id);
    if (notification.hasError()) throw new BadRequestException(notification);
    return notification.data;
  }

  @UseGuards(ApiaryOwnerGuard)
  @UseGuards(CheckApiaryIdGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateApiaryDto: ApiaryUpdateDto,
  ): Promise<void> {
    const result = await this.commandBus.execute<
      UpdateApiaryCommand,
      NotificationResult
    >(new UpdateApiaryCommand(+id, updateApiaryDto));
    if (result.hasError()) throw new BadRequestException();
    return;
  }

  @UseGuards(ApiaryOwnerGuard)
  @UseGuards(CheckApiaryIdGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    const result = await this.commandBus.execute<
      DeleteApiaryCommand,
      NotificationResult
    >(new DeleteApiaryCommand(+id));
    if (result.hasError()) throw new BadRequestException();
    return;
  }
}
