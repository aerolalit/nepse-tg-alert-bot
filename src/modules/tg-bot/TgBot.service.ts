import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import { AppConfigService } from 'src/core/config/appConfig.service';
import { tickers } from './Tickers.list';
import { TickerSubscriptionService } from '../stocks/services/TickerSubscription.service';
import { TickerSubscription } from '../stocks/entities/TickerSubscription.entity';

enum BotCommands {
  start = 'start',
  list_subscriptions = 'list_subscriptions',
  subscribe = 'subscribe',
  unsubscribe = 'unsubscribe',
  help = 'help',
}

@Injectable()
export class TgBotService implements OnModuleInit {
  private bot: TelegramBot;
  private readonly logger = new Logger(TgBotService.name);

  private readonly commands: TelegramBot.BotCommand[] = [
    { command: BotCommands.start, description: 'Start the bot' },
    { command: BotCommands.list_subscriptions, description: 'List all subscriptions' },
    { command: BotCommands.subscribe, description: 'Subscribe for price alerts' },
    { command: BotCommands.unsubscribe, description: 'Unsubscribe subscriptions' },
    { command: BotCommands.help, description: 'Get help' },
  ];

  public constructor(
    private readonly appConfigService: AppConfigService,
    private readonly subscriptionService: TickerSubscriptionService,
  ) {}

  public onModuleInit() {
    const token = this.appConfigService.telegramBotConfig.token;
    this.bot = new TelegramBot(token, { polling: true });

    this.bot.setMyCommands(this.commands);

    this.bot.on('message', (msg: TelegramBot.Message) => {
      const chatId: number = msg.chat.id;
      const text: string = msg.text || '';

      this.handleMessage(chatId, text);
    });

    this.bot.on('callback_query', (callbackQuery) => this.handleCallbackQuery(callbackQuery));
  }

  public async sendPriceAlert(
    chatId: number | string,
    ticker: string,
    ltp: number,
    percentageChange: number,
    intervalInMinutes: number,
  ) {
    const icon = percentageChange > 0 ? '🟢' : '🔴';
    const symbol = percentageChange > 0 ? '+' : '-';
    const interval = intervalInMinutes <= 60 ? `${intervalInMinutes}m` : `${intervalInMinutes / 60}h`;
    const message = icon + ` ${ticker} - ltp: ${ltp} (${symbol}${percentageChange.toFixed(2)}% in last ${interval})`;
    await this.sendMessage(chatId, message);
  }

  private async handleCallbackQuery(callbackQuery: TelegramBot.CallbackQuery) {
    const chatId = callbackQuery.message?.chat.id as TelegramBot.ChatId;
    const data = callbackQuery.data;

    if (chatId && data) {
      if (data && data.startsWith('unsubscribe_')) {
        const ticker = data.split('_')[1];
        await this.subscriptionService.deleteSubscription(chatId.toString(), ticker);
        this.sendMessage(chatId, `Unsubscribed from ${ticker}`);
        this.sendUnsubscribeOptions(chatId); // Refresh the list
      } else if (data.startsWith('more_')) {
        const page = parseInt(data.split('_')[1], 10);
        this.sendSubscribeOptions(chatId, page);
      } else if (data.startsWith('subscribe_')) {
        const ticker = data.split('_')[1];
        await this.subscribeForAlerts(chatId, ticker);
        this.sendMessage(chatId, `Subscribed to ${ticker}`);
      } else {
        this.sendMessage(chatId, `Unknown callback ${data}`);
      }
    }
  }

  private async subscribeForAlerts(chatId: number | string, ticker: string) {
    await this.subscriptionService.createSubscription(chatId.toString(), ticker);
  }

  private handleMessage(chatId: number, text: string) {
    if (text.startsWith('/')) {
      this.handleCommand(chatId, text);
    } else {
      this.logger.log(`Received message: ${text} from chatId: ${chatId}`);
    }
  }

  private handleCommand(chatId: number, command: string) {
    const [cmd] = command.split(' ');

    switch (cmd) {
      case '/list_subscriptions':
        this.listSubscriptions(chatId);
        break;
      case '/start':
        this.sendWelcomeMessage(chatId);
        break;
      case '/help':
        this.sendHelpMessage(chatId);
        this.sendTableMessage(chatId);
        break;
      case '/subscribe':
        this.sendSubscribeOptions(chatId);
        break;
      case '/unsubscribe':
        this.sendUnsubscribeOptions(chatId);
        break;
      default:
        this.sendMessage(chatId, 'Unknown command');
    }
  }

  private async sendUnsubscribeOptions(chatId: number | string) {
    const subscribedTickers = await this.subscriptionService.listSubscriptionsByChatId(chatId.toString());
    if (subscribedTickers.length === 0) {
      this.sendMessage(chatId, 'You have no subscriptions.');
      return;
    }

    const inlineKeyboard: TelegramBot.InlineKeyboardButton[][] = subscribedTickers.map((subs: TickerSubscription) => [
      { text: `Unsubscribe ${subs.ticker}`, callback_data: `unsubscribe_${subs.ticker}` },
    ]);

    const options: TelegramBot.SendMessageOptions = {
      reply_markup: {
        inline_keyboard: inlineKeyboard,
      },
    };

    this.bot.sendMessage(chatId, 'Select a subscription to unsubscribe:', options);
  }

  private sendTableMessage(chatId: number) {
    const tableData = [
      ['Ticker', 'Price', 'Change'],
      ['AAPL', '$150', '+1.5%'],
      ['GOOGL', '$2800', '-0.5%'],
      ['AMZN', '$3400', '+2.0%'],
    ];

    let tableMessage = '```\n';
    tableData.forEach((row) => {
      tableMessage += row.map((cell) => cell.padEnd(10)).join(' ') + '\n';
    });
    tableMessage += '```';

    this.bot.sendMessage(chatId, tableMessage, { parse_mode: 'Markdown' });
  }
  public async listSubscriptions(chatId: number) {
    const subscribedTickers = await this.subscriptionService.listSubscriptionsByChatId(chatId.toString());
    if (subscribedTickers.length === 0) {
      this.sendMessage(chatId, 'You have no subscriptions.');
      return;
    }

    const subscriptionsList = subscribedTickers.map((subs: TickerSubscription) => subs.ticker).join('\n');
    const message = `Your subscriptions:\n${subscriptionsList}`;

    this.sendMessage(chatId, message);
  }

  private async sendSubscribeOptions(chatId: number | string, page: number = 0) {
    const fullPageRow = 10;
    const fullPageCol = 5;
    const fullPageSize = fullPageRow * fullPageCol;
    const pageSize = Math.min(tickers.length - fullPageSize * page, fullPageSize);
    const totalPage = Math.ceil(tickers.length / fullPageSize);
    const start = page * pageSize;
    const end = start + pageSize;
    const tickersPage = tickers.slice(start, end);
    const pageRow = Math.ceil(pageSize / fullPageCol);
    const pageCol = Math.min(fullPageCol, pageSize);

    const inlineKeyboard: TelegramBot.InlineKeyboardButton[][] = this.getRange(pageRow).map((row) =>
      this.getRange(Math.min(pageSize - row * fullPageCol, pageCol))
        .map((col) => {
          const index = row * pageCol + col;
          const ticker = tickersPage[index];

          return {
            text: ticker,
            callback_data: `subscribe_${ticker}`,
          };
        })
        .filter((x) => x),
    );

    if (tickers.length > fullPageSize * page + pageSize) {
      inlineKeyboard.push([{ text: `Load page ${page + 2}`, callback_data: `more_${page + 1}` }]);
    }

    const options: TelegramBot.SendMessageOptions = {
      reply_markup: {
        inline_keyboard: inlineKeyboard,
      },
    };

    await this.bot.sendMessage(chatId, `Please choose ticker. (Page ${page + 1}/${totalPage})`, options);
  }
  private sendWelcomeMessage(chatId: number) {
    const welcomeMessage = `
    Welcome to the NEPSE Alert Bot!
    You can use the following commands:
    /list_subscriptions - List all your subscriptions
    /subscribe - Subscribe to a new ticker
    /unsubscribe - Unsubscribe from a ticker
    /help - Show this help message
      `;
    this.sendMessage(chatId, welcomeMessage);
  }

  private sendHelpMessage(chatId: number) {
    const helpMessage = `
    Here are the available commands:
    ${this.sendCommandDocs(chatId, Object.values(BotCommands))}
      `;
    this.sendMessage(chatId, helpMessage);
  }

  private sendCommandDocs(chatId: number, commandNames: BotCommands[]) {
    const message = commandNames
      .map((cmd) => `/${cmd} ${this.commands.find((x) => cmd === x.command)?.description}`)
      .join('\n');
    this.sendMessage(chatId, message);
  }

  public async sendMessage(chatId: number | string, text: string) {
    return this.bot.sendMessage(chatId, text);
  }

  private getRange(n: number): number[] {
    return Array.from({ length: n }, (_, i) => i);
  }
}
