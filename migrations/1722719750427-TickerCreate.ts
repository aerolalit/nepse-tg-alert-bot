import { MigrationInterface, QueryRunner } from 'typeorm';
import { addPk, quote } from './MigrationHelper';

export class CreateTickerTable1634567890123 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE ${quote('Ticker')} (
        "ticker" text NOT NULL,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        ${addPk('Ticker', ['ticker'])}
      )
    `);
    const tickers = [
      'HRL',
      'PPL',
      'AHL',
      'ALBSL',
      'AKPL',
      'HIDCL',
      'PROFL',
      'CITY',
      'AKJCL',
      'ADBL',
      'KBSH',
      'CIT',
      'SBL',
      'NBL',
      'CID',
      'NRIC',
      'FOWRD',
      'NRN',
      'SHIVM',
      'NHPL',
      'UPCL',
      'UPPER',
      'WOMI',
      'NIFRA',
      'KDL',
      'NLIC',
      'MEGA',
      'KRBL',
      'KMCDB',
      'ILI',
      'SMHL',
      'TAMOR',
    ];

    const values = tickers.map((ticker) => `('${ticker}')`).join(', ');

    await queryRunner.query(`
          INSERT INTO ${quote('Ticker')} ("ticker")
          VALUES ${values}
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE ${quote('Ticker')}`);
  }
}
