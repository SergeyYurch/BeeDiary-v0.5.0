import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateBreedDto {
  @ApiProperty()
  @IsString()
  title: string;
}
