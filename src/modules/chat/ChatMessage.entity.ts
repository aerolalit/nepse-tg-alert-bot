import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from 'typeorm';

@Entity('ChatMessage')
export class ChatMessage {
  @PrimaryColumn('text')
  public id: string;

  @Column('text')
  public senderId: string;

  @Column('text')
  public type: string;

  @Column('text')
  public message: string;

  @CreateDateColumn({ type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  public updatedAt: Date;
}
