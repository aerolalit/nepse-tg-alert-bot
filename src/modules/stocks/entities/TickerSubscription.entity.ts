import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Ticker } from './Ticker.entity';

@Entity('TickerSubscription')
export class TickerSubscription {
  @PrimaryColumn({ type: 'text' })
  public chatId: string;

  @PrimaryColumn({ type: 'text' })
  public ticker: string;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  public createdAt: Date;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  public updatedAt: Date;

  @ManyToOne(() => Ticker, (ticker) => ticker.tickerSubscriptions)
  @JoinColumn({ name: 'ticker' })
  public Ticker: Ticker;
}
