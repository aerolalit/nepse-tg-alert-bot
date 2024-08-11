import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Ticker } from '../stocks/entities/Ticker.entity';

@Entity('NotificationLog')
export class NotificationLog {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column('text')
  public ticker: string;

  @Column('timestamptz')
  public sentAt: Date;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @ManyToOne(() => Ticker, (ticker) => ticker.tickerSubscriptions)
  public tickerEntity: Ticker;
}
