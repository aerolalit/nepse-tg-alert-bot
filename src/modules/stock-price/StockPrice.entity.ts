import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';


@Entity('StockPrice')
export class StockPrice {
  @PrimaryColumn('text')
  public ticker: string;

  @PrimaryColumn('timestamptz')
  public priceTime: Date;

  @Column('decimal')
  public ltp: number;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  constructor(data: Partial<StockPrice>) {
    Object.assign(this, data);
  }

}

