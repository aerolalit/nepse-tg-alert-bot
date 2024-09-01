import { MigrationInterface, QueryRunner } from 'typeorm';
import { addPk, quote } from './MigrationHelper';

export class UserCreate1725191193818 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE ${quote('User')} (
        "id" text NOT NULL,
        "firstName" text,
        "username" text,
        "isBot" boolean,
        "languageCode" text,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        ${addPk('User', ['id'])}
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE ${quote('User')}`);
  }
}