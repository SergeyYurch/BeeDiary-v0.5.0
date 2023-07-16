import { ApiProperty, PartialType } from '@nestjs/swagger';
import { ApiaryCreateDto } from './apiary.create.dto';
import { ApiaryType } from '../../../../domain/apiary';
import { IsDateString, IsEnum, IsString, Length } from 'class-validator';

export class ApiaryUpdateDto extends PartialType(ApiaryCreateDto) {
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
  disbandedAt: Date;

  @ApiProperty()
  @IsString()
  @Length(1, 200)
  note: string;
}
