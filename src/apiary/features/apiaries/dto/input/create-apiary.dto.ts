import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { ApiaryType } from '../../../../domain/apiary';

export class CreateApiaryDto {
  @ApiProperty()
  @IsString()
  @IsEnum(ApiaryType)
  type: ApiaryType;

  @ApiProperty()
  @IsString()
  @Length(1, 100)
  location: string;

  @ApiProperty()
  @IsDateString()
  createdAt: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  disbandedAt?: Date;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(1, 200)
  note?: string;
}
