import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, IsString } from 'class-validator';

export class FrameCreateInputDto {
  @ApiProperty()
  @IsString()
  type: string;

  @ApiProperty()
  @IsPositive()
  @IsInt()
  width: number;

  @ApiProperty()
  @IsPositive()
  @IsInt()
  height: number;

  @ApiProperty()
  @IsPositive()
  @IsInt()
  cellsNumber: number;
}
