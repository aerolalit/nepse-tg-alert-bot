import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ChatMessageType } from '../enums/ChatMessageType.enum';

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
  public type: ChatMessageType;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public message: string;
}
