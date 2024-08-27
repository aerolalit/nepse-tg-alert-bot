import { Controller, Get, Post, Body } from '@nestjs/common';
import { TickerService } from '../services/Ticker.service';
import { Ticker } from '../entities/Ticker.entity';
import { CreateTickerDto } from '../dtos/CreateTicker..dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { InsertResult } from 'typeorm';

@ApiTags('tickers')
@Controller('tickers')
export class TickerController {
  constructor(private readonly tickerService: TickerService) {}

  @ApiTags('tickers')
  @ApiResponse({ status: 201, description: 'The record has been successfully created.' })
  @Post()
  public async create(@Body() createTickerDto: CreateTickerDto): Promise<InsertResult> {
    return this.tickerService.insert(createTickerDto);
  }

  @Get()
  public async findAll(): Promise<Ticker[]> {
    return this.tickerService.findAll();
  }
}
