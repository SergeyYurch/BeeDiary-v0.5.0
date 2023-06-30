import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateApiaryDto } from './create-apiary.dto';
import { ApiaryType } from '../../../../domain/apiary';
import { IsDateString, IsEnum, IsString, Length } from 'class-validator';

export class UpdateApiaryDto extends PartialType(CreateApiaryDto) {
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
