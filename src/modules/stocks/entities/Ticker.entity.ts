import { Entity, PrimaryColumn, CreateDateColumn, UpdateDateColumn, Column, OneToMany } from 'typeorm';
import { TickerSubscription } from './TickerSubscription.entity';

@Entity('Ticker')
export class Ticker {
  @PrimaryColumn('text')
  public ticker: string;

  @Column('text', { nullable: true })
  public name: string;

  @Column('text', { nullable: true })
  public status: string;

  @Column('text', { nullable: true })
  public sector: string;

  @Column('text', { nullable: true })
  public group: string;

  @Column('text', { nullable: true })
  public type: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @OneToMany(() => TickerSubscription, (tickerSubscription) => tickerSubscription.ticker)
  public tickerSubscriptions: TickerSubscription[];
}