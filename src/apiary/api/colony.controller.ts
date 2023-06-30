import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { CreateColonyDto } from '../features/colonies/dto/create-colony.dto';
import { UpdateColonyDto } from '../features/colonies/dto/update-colony.dto';

@Controller('colony')
export class ColonyController {
  @Post()
  create(@Body() createColonyDto: CreateColonyDto) {
    return;
  }

  @Get()
  findAll() {
    return;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return;
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateApiaryDto: UpdateColonyDto) {
    return;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return;
  }
}
