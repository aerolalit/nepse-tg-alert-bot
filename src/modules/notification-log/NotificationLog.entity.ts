import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

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
}
