import { MigrationInterface, QueryRunner } from 'typeorm';
import { addPk, quote, addFk } from './MigrationHelper';

export class NotificationLogCreate1722720177243 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE ${quote('NotificationLog')} (
                "id" SERIAL PRIMARY KEY,
                "ticker" text NOT NULL,
                "sentAt" TIMESTAMPTZ NOT NULL,
                "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
                ${addFk('NotificationLog', ['ticker'], 'Ticker', ['ticker'])}
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE ${quote('NotificationLog')}`);
  }
}
