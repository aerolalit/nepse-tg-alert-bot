import { MigrationInterface, QueryRunner } from "typeorm"
import { addPk, quote, addFk } from './MigrationHelper';


export class ChatMessage1725193985083 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE ${quote('ChatMessage')} (
              "chatId" text NOT NULL,
              "senderId" text NOT NULL,
              "id" text NOT NULL,
              "type" text NOT NULL,
              "message" text NOT NULL,
              "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
              "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
              ${addPk('ChatMessage', ['chatId', 'senderId', 'id'])},
              ${addFk('ChatMessage', ['senderId'], 'User', ['id'])} ON DELETE CASCADE
            )
          `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE ${quote('ChatMessage')}`);

    }

}
