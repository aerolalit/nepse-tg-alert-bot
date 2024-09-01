import { MigrationInterface, QueryRunner } from 'typeorm';
import { addPk, quote } from './MigrationHelper';

export class ChatCreate1725207670161 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE ${quote('Chat')} (
        "id" text NOT NULL,
        "name" text NOT NULL,
        "type" text NOT NULL,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        ${addPk('Chat', ['id'])}
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE ${quote('Chat')}`);
  }
}