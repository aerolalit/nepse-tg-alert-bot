import { MigrationInterface, QueryRunner } from 'typeorm';
import { addPk, quote, addFk } from './MigrationHelper';

export class StockPriceCreate1722720177242 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE ${quote('TickerPrice')} (
                "ticker" text NOT NULL,
                "priceTime" TIMESTAMPTZ NOT NULL,
                "ltp" decimal NOT NULL,
                "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
                ${addPk('TickerPrice', ['ticker', 'priceTime'])},
                ${addFk('TickerPrice', ['ticker'], 'Ticker', ['ticker'])}
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE ${quote('TickerPrice')}`);
  }
}
