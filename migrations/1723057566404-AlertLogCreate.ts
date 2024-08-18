import { MigrationInterface, QueryRunner } from 'typeorm';
import { addPk, quote, addFk } from './MigrationHelper';

export class AlertLogCreate1722720177243 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE ${quote('AlertLog')} (
        "id" SERIAL PRIMARY KEY,
        "ticker" text NOT NULL,
        "sentAt" TIMESTAMPTZ NOT NULL,
        "alertType" text NOT NULL,
        "percentageChange" float NOT NULL,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        ${addFk('AlertLog', ['ticker'], 'Ticker', ['ticker'])}
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE ${quote('AlertLog')}`);
  }
}