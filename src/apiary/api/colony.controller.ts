import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { CreateColonyDto } from '../features/colonies/dto/input/create-colony.dto';
import { UpdateColonyDto } from '../features/colonies/dto/input/update-colony.dto';
import { BaseControllerInterface } from '../../common/interfaces/baseControllerInterface';
import { ColonyViewDto } from '../features/colonies/dto/view/colony.view.dto';
import { PaginatorViewModel } from '../../common/dto/view-models/paginator.view.model';
import { CommandBus } from '@nestjs/cqrs';
import { User } from '../../account/features/users/domain/user';
import { PaginatorInputType } from '../../common/dto/input-models/paginator.input.type';
import { CurrentUserModel } from '../../account/decorators/current-user-model.param.decorator';
import { PaginatorParam } from '../../common/decorators/paginator-param.decorator';

@Controller('colony')
export class ColonyController
  implements
    BaseControllerInterface<CreateColonyDto, UpdateColonyDto, ColonyViewDto>
{
  constructor(private readonly commandBus: CommandBus) {}
  @Post()
  async create(
    @Body() createColonyDto: CreateColonyDto,
  ): Promise<ColonyViewDto> {
    return new ColonyViewDto();
  }

  @Get()
  async findAll(
    @CurrentUserModel() user: User,
    @PaginatorParam() paginatorParams: PaginatorInputType,
  ): Promise<PaginatorViewModel<ColonyViewDto>> {
    return;
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ColonyViewDto> {
    return;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateApiaryDto: UpdateColonyDto,
  ) {
    return;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return;
  }
}
