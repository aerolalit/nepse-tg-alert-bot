import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('User')
export class User {
  @PrimaryColumn('text')
  public id: string;

  @Column('text', { nullable: true })
  public firstName: string;

  @Column('text', { nullable: true })
  public username?: string;

  @Column('boolean', { nullable: true, default: false })
  public isBot?: boolean;

  @Column('text', { nullable: true })
  public languageCode?: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
