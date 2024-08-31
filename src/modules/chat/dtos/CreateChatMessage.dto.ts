import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateChatMessageDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => String)
  public id?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public senderId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public type: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public message: string;
}