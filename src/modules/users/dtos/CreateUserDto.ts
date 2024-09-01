import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsNumber, IsDate } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsNumber()
  public id: string;

  @ApiProperty()
  @IsBoolean()
  public isBot?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public firstName?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  public username?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  public languageCode?: string;

  @ApiPropertyOptional()
  @IsDate()
  @IsOptional()
  public updatedAt?: Date;
}
