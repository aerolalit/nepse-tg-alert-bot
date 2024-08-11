import { LocalStorageService } from '../cache-stroage/LocalStorage.service';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const MTProto = require('@mtproto/core');
import * as moment from 'moment';
import 'moment-timezone';
import * as dotenv from 'dotenv';
import { Logger } from '@nestjs/common';

dotenv.config();
interface StockData {
  ticker: string;
  ltp: number;
  priceTime: Date;
}
interface Update {
  updates?: Array<any>;
}

interface Message {
  peer_id: {
    user_id: number;
  };
  [key: string]: any;
}

interface CodeSettings {
  _: string;
}

interface SendCodeResult {
  phone_code_hash: string;
  [key: string]: any;
}

interface SignInResult {
  [key: string]: any;
}

interface ResolveUsernameResult {
  users: Array<{ id: number; access_hash: string }>;
  [key: string]: any;
}

interface SendMessageResult {
  [key: string]: any;
}

interface GetMessageHistoryResult {
  messages: Array<{ id: number; message: string; date: number }>;
  [key: string]: any;
}

export class UserBotService {
  private readonly logger = new Logger(UserBotService.name);
  private mtproto: typeof MTProto;
  private phoneNumber: string;

  public constructor() {
    this.mtproto = new MTProto({
      api_id: process.env.USER_BOT_API_ID,
      api_hash: process.env.USER_BOT_API_HASH,
      storageOptions: {
        instance: new LocalStorageService(),
      },
    });
    this.phoneNumber = process.env.USER_BOT_PHONE_NUMBER as string;
  }

  public async sendCode(): Promise<SendCodeResult | undefined> {
    try {
      const result: SendCodeResult = await this.mtproto.call('auth.sendCode', {
        phone_number: this.phoneNumber,
        settings: {
          _: 'codeSettings',
        } as CodeSettings,
      });

      return result;
    } catch (error) {
      this.logger.error('Error sending code:', error);
    }
  }

  public async signIn(phoneCodeHash: string, code: string): Promise<SignInResult | undefined> {
    try {
      const result: SignInResult = await this.mtproto.call('auth.signIn', {
        phone_number: this.phoneNumber,
        phone_code_hash: phoneCodeHash,
        phone_code: code,
      });

      return result;
    } catch (error) {
      this.logger.error('Error signing in:', error);
    }
  }

  public async sendMessage(username: string, message: string): Promise<SendMessageResult | undefined> {
    try {
      const { users }: ResolveUsernameResult = await this.mtproto.call('contacts.resolveUsername', {
        username,
      });

      const userId = users[0].id;

      const result: SendMessageResult = await this.mtproto.call('messages.sendMessage', {
        peer: {
          _: 'inputPeerUser',
          user_id: userId,
          access_hash: users[0].access_hash,
        },
        message,
        random_id: Math.floor(Math.random() * 0xffffff),
      });
      this.logger.log(`Sent message to ${username}: ${message}`);
      return result;
    } catch (error) {
      this.logger.error('Error sending message:', error);
    }
  }

  public async getMessageHistory(
    limit: number = 20,
    filterByBot: boolean = true,
  ): Promise<GetMessageHistoryResult | undefined> {
    try {
      const { users } = await this.mtproto.call('contacts.resolveUsername', {
        username: process.env.PRICE_BOT_USERNAME,
      });

      const userId = users[0].id;
      const accessHash = users[0].access_hash;

      const result = await this.mtproto.call('messages.getHistory', {
        peer: {
          _: 'inputPeerUser',
          user_id: userId,
          access_hash: accessHash,
        },
        limit,
      });
      if (filterByBot) {
        const botMessages = result.messages.filter((message: any) => !message.out);
        return {
          ...result,
          messages: botMessages,
        };
      }

      return result;
    } catch (error) {
      console.error('Error getting message history:', error);
      return undefined;
    }
  }

  public async subscribeToNewMessages(username: string, callback: (message: Message) => void): Promise<void> {
    try {
      await this.mtproto.call('contacts.resolveUsername', {
        username,
      });

      this.mtproto.updates.on('updates', (update: Update) => {
        if (update.updates) {
          update.updates.forEach((u: any) => {
            if (u._ === 'updateNewMessage') {
              callback(u.message.message as Message);
            }
          });
        }
      });

      const a = await this.mtproto.call('updates.getState');
      this.logger.log('Subscribed to new messages', a);
    } catch (error) {
      this.logger.error('Error subscribing to new messages:', error);
    }
  }

  public async fetchAndExtractStockData(tickerCount: number): Promise<StockData[]> {
    const numberOfMessages = Math.ceil((tickerCount / 10) * 2);
    const messageHistory = await this.getMessageHistory(numberOfMessages);
    if (!messageHistory) {
      return [];
    }

    const stockDataMap = new Map<string, StockData>();
    const regex = /(\w+):\s*LTP:\s*([\d.]+),\s*Change:\s*([-\d.]+)\s*\(([-\d.]+%)\)(🔴|🟢)/g;

    for (const message of messageHistory.messages) {
      const text = message.message;
      const timestampMatch = text.match(/As of: (\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} [APM]{2})/);
      const priceTime = timestampMatch
        ? moment.tz(timestampMatch[1], 'YYYY-MM-DD hh:mm:ss A', 'Asia/Kathmandu').utc().toDate()
        : null;
      if (!priceTime) {
        this.logger.error('Error parsing price time:', text);
        continue;
      }
      let match;
      while ((match = regex.exec(text)) !== null) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_, ticker, ltp] = match;
        const key = `${ticker}-${priceTime.getTime()}`;
        if (!stockDataMap.has(key)) {
          stockDataMap.set(key, {
            ticker,
            ltp: parseFloat(ltp),
            priceTime,
          });
        }
      }
    }

    return Array.from(stockDataMap.values());
  }
}
