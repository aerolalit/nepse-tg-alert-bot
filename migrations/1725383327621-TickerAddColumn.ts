import { MigrationInterface, QueryRunner } from "typeorm"
import { quote } from './MigrationHelper';

export class TickerAddColumn1725383327621 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE ${quote('Ticker')}
            ADD COLUMN ${quote('name')} text NULL,
            ADD COLUMN ${quote('status')} text NULL,
            ADD COLUMN ${quote('sector')} text NULL,
            ADD COLUMN ${quote('group')} text NULL,
            ADD COLUMN ${quote('type')} text NULL;
          `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE ${quote('Ticker')}
            DROP COLUMN ${quote('name')},
            DROP COLUMN ${quote('status')},
            DROP COLUMN ${quote('sector')},
            DROP COLUMN ${quote('group')},
            DROP COLUMN ${quote('type')};
          `);
    }

}
