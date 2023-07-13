import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class ColonyUpdateDto {
  @ApiProperty()
  @Min(0)
  @IsInt()
  number: number;

  @ApiProperty()
  @IsString()
  hiveTypeId: string;

  @ApiProperty()
  @IsString()
  nestsFrameTypeId: string;

  @ApiProperty()
  @IsString()
  queenId: string;

  @ApiProperty()
  @Min(0)
  @IsInt()
  @IsOptional()
  condition: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  note: string;

  @ApiProperty()
  @Min(0)
  @IsInt()
  status: number;
}
