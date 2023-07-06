import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  HttpStatus,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import { ApiaryService } from '../features/apiaries/providers/apiary.service';
import { CreateApiaryDto } from '../features/apiaries/dto/input/create-apiary.dto';
import { UpdateApiaryDto } from '../features/apiaries/dto/input/update-apiary.dto';
import { ApiTags } from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import { CreateApiaryCommand } from '../features/apiaries/providers/use-cases/create-apiary-use-case';
import { AccessTokenUGuard } from '../../common/guards/access-token-u.guard';
import { User } from '../../account/features/users/domain/user';
import { ApiaryQueryRepository } from '../features/apiaries/providers/apiary.query.repository';
import { CurrentUserModel } from '../../common/decorators/current-user-model.param.decorator';
import { PaginatorParam } from '../../common/decorators/paginator-param.decorator';
import { PaginatorInputType } from '../../common/dto/input-models/paginator.input.type';
import { UpdateApiaryCommand } from '../features/apiaries/providers/use-cases/update-apiary-use-case';
import { CheckApiaryIdGuard } from '../../common/guards/check-apiary-id.guard';
import { DeleteApiaryCommand } from '../features/apiaries/providers/use-cases/delete-apiary-use-case';
import { NotificationResult } from '../../common/notification/notificationResult';
import { ApiaryViewModel } from '../features/apiaries/dto/view-models/apiary.view.model';
import { ApiaryOwnerGuard } from '../../common/guards/apiary-owner.guard';

@ApiTags('apiary')
@UseGuards(AccessTokenUGuard)
@Controller('apiaries')
export class ApiariesController {
  constructor(
    private readonly apiaryQueryRepository: ApiaryQueryRepository,
    private readonly apiaryService: ApiaryService,
    private commandBus: CommandBus,
  ) {}

  @Post()
  async create(
    @Body() createApiaryDto: CreateApiaryDto,
    @CurrentUserModel() user: User,
  ) {
    const resultOfCreate = await this.commandBus.execute<
      CreateApiaryCommand,
      NotificationResult<string>
    >(new CreateApiaryCommand(createApiaryDto, user));
    if (resultOfCreate.hasError())
      throw new BadRequestException(resultOfCreate);
    const apiaryId = resultOfCreate.data;
    const resultOfView = await this.apiaryQueryRepository.getApiaryView(
      apiaryId,
    );
    if (!resultOfView.hasError()) return resultOfView.data;
    throw new BadRequestException(resultOfCreate);
  }

  @Get()
  async findAll(
    @CurrentUserModel() user: User,
    @PaginatorParam() paginatorParams: PaginatorInputType,
  ) {
    return this.apiaryQueryRepository.getAllApiaryViews(
      paginatorParams,
      +user.id,
    );
  }

  @UseGuards(ApiaryOwnerGuard)
  @UseGuards(CheckApiaryIdGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiaryViewModel> {
    const notification = await this.apiaryQueryRepository.getApiaryView(id);
    if (notification.hasError()) throw new BadRequestException(notification);
    return notification.data;
  }

  @UseGuards(ApiaryOwnerGuard)
  @UseGuards(CheckApiaryIdGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateApiaryDto: UpdateApiaryDto,
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
