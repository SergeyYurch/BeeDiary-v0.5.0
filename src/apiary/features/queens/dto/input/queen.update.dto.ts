import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class QueenUpdateDto {
  @ApiProperty()
  @IsString()
  breedId: string;

  @ApiProperty()
  @Min(1)
  @Max(12)
  @IsInt()
  @IsOptional()
  flybyMonth: number | null;

  @ApiProperty()
  @Min(2014)
  @Max(2050)
  @IsInt()
  @IsOptional()
  flybyYear: number | null;

  @ApiProperty()
  @IsString()
  @IsOptional()
  note: string | null;

  @ApiProperty()
  @Min(0)
  @IsInt()
  @IsOptional()
  condition: number | null;

  @ApiProperty()
  @IsString()
  @IsOptional()
  graftingId: string | null;
}
