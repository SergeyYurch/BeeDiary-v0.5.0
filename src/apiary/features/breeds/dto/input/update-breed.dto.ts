import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateBreedDto {
  @ApiProperty()
  @IsString()
  title: string;
}
