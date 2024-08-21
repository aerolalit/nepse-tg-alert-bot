import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('AlertLog')
export class AlertLog {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column('text')
  public ticker: string;

  @Column('timestamptz')
  public sentAt: Date;

  @Column('text')
  public alertType: string;

  @Column('float')
  public percentageChange: number;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
