import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class BroadCastMessageDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  message: string;
}
