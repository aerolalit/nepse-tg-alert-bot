import { Ticker } from 'src/modules/stocks/entities/Ticker.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('MilestoneAlert')
export class MilestoneAlert {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column('text')
  public ticker: string;

  @Column('int')
  public milestone: number;

  @Column('text')
  public direction: 'UP' | 'DOWN';

  @CreateDateColumn({ type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  public updatedAt: Date;

  @ManyToOne(() => Ticker)
  @JoinColumn({ name: 'ticker', referencedColumnName: 'ticker' })
  public tickerEntity: Ticker;

  constructor(partial: Partial<MilestoneAlert>) {
    Object.assign(this, partial);
  }
}
