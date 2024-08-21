import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('TickerPrice')
export class TickerPrice {
  @PrimaryColumn('text')
  public ticker: string;

  @PrimaryColumn('timestamptz')
  public priceTime: Date;

  @Column('numeric')
  public ltp: number;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
