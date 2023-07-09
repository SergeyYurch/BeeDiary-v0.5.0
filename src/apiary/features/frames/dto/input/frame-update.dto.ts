import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Min } from 'class-validator';

export class FrameUpdateDto {
  @ApiProperty()
  @IsString()
  type: string;

  @ApiProperty()
  @Min(0)
  @IsInt()
  width: number;

  @ApiProperty()
  @Min(0)
  @IsInt()
  height: number;

  @ApiProperty()
  @Min(0)
  @IsInt()
  numberOfCells: number;
}
