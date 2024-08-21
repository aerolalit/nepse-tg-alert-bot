import { MigrationInterface, QueryRunner } from 'typeorm';
import { addFk, quote } from './MigrationHelper';

export class MilestoneCreate1724176339754 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "MilestoneAlert" (
          "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          "ticker" text NOT NULL,
          "milestone" integer NOT NULL,
          "direction" text NOT NULL,
          "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
          "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
          ${addFk('MilestoneAlert', ['ticker'], 'Ticker', ['ticker'])}
        )
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE ${quote('MilestoneAlert')}`);
  }
}
