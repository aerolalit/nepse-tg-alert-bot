import { MigrationInterface, QueryRunner } from "typeorm";

export class StockPriceCreate1722623129474 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "StockPrice" (
                "ticker" text NOT NULL,
                "priceTime" timestamptz NOT NULL,
                "ltp" decimal NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                PRIMARY KEY ("ticker", "priceTime")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "StockPrice"`);
    }

}