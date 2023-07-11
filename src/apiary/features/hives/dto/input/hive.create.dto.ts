import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class HiveCreateDto {
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
  @IsOptional()
  frameTypeId: string | null;
}
