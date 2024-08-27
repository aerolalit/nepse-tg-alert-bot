import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUppercase, MinLength } from 'class-validator';

export class CreateTickerDto {
  @ApiProperty({ example: 'PROFL', description: 'The ticker symbol of the stock' })
  @IsString()
  @IsUppercase()
  @MinLength(2)
  @MinLength(5)
  readonly ticker: string;
}
