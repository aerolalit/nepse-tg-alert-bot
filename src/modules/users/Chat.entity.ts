import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('Chat')
export class Chat {
  @PrimaryColumn('text')
  public id: string;

  @Column('text')
  public name: string;

  @Column('text')
  public type: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
