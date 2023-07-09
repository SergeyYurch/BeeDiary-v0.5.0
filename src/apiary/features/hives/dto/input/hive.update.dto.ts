import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Min } from 'class-validator';

export class HiveUpdateDto {
  @ApiProperty()
  @IsString()
  title: string;

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
  long: number;

  @ApiProperty()
  @Min(0)
  @IsInt()
  numberOfFrames: number;

  @ApiProperty()
  @IsString()
  frameTypeId: string;
}
