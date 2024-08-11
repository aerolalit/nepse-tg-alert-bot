import { Entity, PrimaryColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { TickerSubscription } from './TickerSubscription.entity';

@Entity('Ticker')
export class Ticker {
  @PrimaryColumn('text')
  public ticker: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @OneToMany(() => TickerSubscription, (tickerSubscription) => tickerSubscription.ticker)
  public tickerSubscriptions: TickerSubscription[];
}
