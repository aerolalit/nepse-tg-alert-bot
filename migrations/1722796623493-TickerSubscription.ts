import { MigrationInterface, QueryRunner } from 'typeorm';
import { addPk, quote, addFk } from './MigrationHelper';

export class CreateTickerSubscriptionTable1634567890124 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE ${quote('TickerSubscription')} (
                "chatId" text NOT NULL,
                "ticker" text NOT NULL,
                "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
                ${addPk('TickerSubscription', ['chatId', 'ticker'])},
                ${addFk('TickerSubscription', ['ticker'], 'Ticker', ['ticker'])}
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE ${quote('TickerSubscription')}`);
  }
}
