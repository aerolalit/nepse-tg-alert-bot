import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import { AppConfigService } from 'src/core/config/appConfig.service';
import { TickerSubscriptionService } from '../stocks/services/TickerSubscription.service';
import { TickerSubscription } from '../stocks/entities/TickerSubscription.entity';
import { TickerService } from '../stocks/services/Ticker.service';
import { ChatMessageService } from '../chat/ChatMessage.service';
import { CreateChatMessageDto } from '../chat/dtos/CreateChatMessage.dto';
import { ChatMessageType } from '../chat/enums/ChatMessageType.enum';

enum BotCommands {
  start = 'start',
}

enum BotMessages {
  RequestTicker = 'Please enter the ticker you want to request',
  RequestFeature = 'Please provide the details of the feature you want to request.',
  Feedback = 'Please write your feedback.',
}

@Injectable()
export class TgBotService implements OnModuleInit {
  private bot: TelegramBot;
  private readonly logger = new Logger(TgBotService.name);

  private readonly commands: TelegramBot.BotCommand[] = [{ command: BotCommands.start, description: 'Start the bot' }];

  public constructor(
    private readonly appConfigService: AppConfigService,
    private readonly subscriptionService: TickerSubscriptionService,
    private readonly tickerService: TickerService,
    private readonly chatMessageService: ChatMessageService,
  ) {}

  public onModuleInit() {
    const token = this.appConfigService.telegramBotConfig.token;
    this.bot = new TelegramBot(token, { polling: true });

    this.bot.setMyCommands(this.commands);

    this.bot.on('message', async (msg: TelegramBot.Message) => this.handleMessage(msg));

    this.bot.on('callback_query', (callbackQuery) => this.handleCallbackQuery(callbackQuery));
  }

  public async handleMessage(msg: TelegramBot.Message) {
    const chatId: number = msg.chat.id;
    const text: string = msg.text || '';
    const chatMessage: CreateChatMessageDto = {
      id: msg.message_id.toString(),
      senderId: chatId.toString(),
      type: ChatMessageType.Text,
      message: text,
    };

    if (msg.reply_to_message && msg.reply_to_message.text) {
      switch (msg.reply_to_message.text) {
        case BotMessages.RequestTicker:
          chatMessage.type = ChatMessageType.TickerRequest;
          await this.chatMessageService.create(chatMessage);
          await this.bot.sendMessage(chatId, 'Ticker request received. We will notify you when it is added.', {reply_to_message_id: msg.message_id});
          break;
        case BotMessages.RequestFeature:
          chatMessage.type = ChatMessageType.FeatureRequest;
          await this.chatMessageService.create(chatMessage);
          await this.bot.sendMessage(chatId, 'Feature request received. We will notify you when it is added.', {reply_to_message_id: msg.message_id});
          break;
        case BotMessages.Feedback:
          chatMessage.type = ChatMessageType.Feedback;
          await this.chatMessageService.create(chatMessage);
          await this.bot.sendMessage(chatId, 'Feedback received. Thank you for your feedback.', {reply_to_message_id: msg.message_id});
          break;
      }
      return;
    }

    switch (text) {
      case '/start':
        await this.sendMenuMessage(chatId);
        break;
    }
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

  private async subscribeForAlerts(chatId: number | string, ticker: string) {
    await this.subscriptionService.createSubscription(chatId.toString(), ticker);
  }

  public getMenuButtons(): TelegramBot.InlineKeyboardButton[][] {
    return [
      [{ text: 'Subscribe new alerts', callback_data: 'subscribeNewAlert' }],
      [{ text: 'Unsubscribe', callback_data: 'unsubscribeAlert' }],
      [{ text: 'List all Subscription', callback_data: 'listSubscriptions' }],
      [{ text: 'Feedback / Feature Request', callback_data: 'feedbackAndRequest'}]
    ];
  }

  public async sendMenuMessage(chatId: number | string) {
    const message = 'Choose an option:';
    const buttons = this.getMenuButtons();
    await this.sendMessage(chatId, message, -1, buttons);
  }

  private async handleCallbackQuery(callbackQuery: TelegramBot.CallbackQuery) {
    const chatId = callbackQuery.message?.chat.id as TelegramBot.ChatId;
    const messageId = callbackQuery.message?.message_id as number;
    const data = callbackQuery.data;

    const commandData = data?.split('_');

    let menuButton = false;

    if (chatId && data && commandData?.length) {
      let newMessage = 'as';
      let newButtons: TelegramBot.InlineKeyboardButton[][] = [];

      switch (commandData[0]) {
        case 'subscribeNewAlert':
          newButtons = await this.getTickerButtons();
          newMessage = 'Click on the ticker to subscribe:';
          menuButton = true;
          break;
        case 'listSubscriptions':
          await this.listSubscriptions(chatId);
          return;
        case 'unsubscribeTicker':
          const tickerToUnsubscribe = commandData[1];
          await this.subscriptionService.deleteSubscription(chatId.toString(), tickerToUnsubscribe);
          await this.sendMessage(chatId, `Unsubscribed from ${tickerToUnsubscribe}`, 10000);
        case 'unsubscribeAlert':
          newMessage = 'Click on the ticker to unsubscribe:';
          newButtons = await this.getUnsubscribeButtons(chatId);
          menuButton = true;
          break;
        case 'loadSubscribePageNo':
          newMessage = `Click on the ticker to subscribe:`;
          const pageNo = parseInt(commandData[1], 10);
          newButtons = await this.getTickerButtons(pageNo);
          menuButton = true;
          break;
        case 'subscribeAlertsFor':
          const ticker = commandData[1];
          await this.subscribeForAlerts(chatId, ticker);
          newMessage = `Subscribed alerts for ${ticker}`;
          return this.sendMessage(chatId, newMessage, 10000);
        case 'loadMenu':
          newButtons = this.getMenuButtons();
          newMessage = 'Choose an option:';
          break;

        case 'feedbackAndRequest':
          newButtons = [
            [{ text: 'Request new ticker.', callback_data: 'reqeustNewTicker' }],
            [{ text: 'Request new feature', callback_data: 'reqeustNewFeature' }],
            [{ text: 'Provide feedback', callback_data: 'submitFeedback' }],
            this.menuBackButton,
          ];
          newMessage = 'Choose an option:';
          break;
        
        case 'reqeustNewTicker':
            await this.bot.sendMessage(chatId, BotMessages.RequestTicker, {
              reply_markup: { force_reply: true },
            });
          return;
        case 'reqeustNewFeature':
          await this.bot.sendMessage(chatId, BotMessages.RequestFeature, { reply_markup: { force_reply: true } });
          return;
        case 'submitFeedback':
          await this.bot.sendMessage(chatId, BotMessages.Feedback, { reply_markup: { force_reply: true } });
          return;
        default:
          newMessage = 'Invalid command';
      }

      menuButton && newButtons.push(this.menuBackButton);
      await this.editMessageText(chatId, messageId, newMessage, newButtons);
    }
  }
  private get menuBackButton(): TelegramBot.InlineKeyboardButton[] {
    return [{ text: '🔙', callback_data: 'loadMenu' }]
  }

  private async editMessageText(
    chatId: number | string,
    messageId: number,
    newText: string,
    buttons: TelegramBot.InlineKeyboardButton[][],
  ) {
    const options = {
      chat_id: chatId,
      message_id: messageId,
      reply_markup: {
        inline_keyboard: buttons,
      },
    };

    await this.bot.editMessageText(newText, options);
  }

  private async getUnsubscribeButtons(chatId: number | string): Promise<TelegramBot.InlineKeyboardButton[][]> {
    const subscribedTickers = await this.subscriptionService.listSubscriptionsByChatId(chatId.toString());
    return subscribedTickers.map((subs: TickerSubscription) => [
      { text: `Unsubscribe ${subs.ticker}`, callback_data: `unsubscribeTicker_${subs.ticker}` },
    ]);
  }

  public async listSubscriptions(chatId: TelegramBot.ChatId) {
    const subscribedTickers = await this.subscriptionService.listSubscriptionsByChatId(chatId.toString());
    if (subscribedTickers.length === 0) {
      this.sendMessage(chatId, 'You have no subscriptions.', 10000);
      return;
    }

    const subscriptionsList = subscribedTickers.map((subs: TickerSubscription) => subs.ticker).join('\n');
    const message = `Your subscriptions:\n${subscriptionsList}`;

    this.sendMessage(chatId, message, 10000);
  }

  private async getTickerButtons(page: number = 0): Promise<TelegramBot.InlineKeyboardButton[][]> {
    const tickersObj = await this.tickerService.findAll();
    const tickers = tickersObj.map((x) => x.ticker);

    const fullPageRow = 2;
    const fullPageCol = 4;
    const fullPageSize = fullPageRow * fullPageCol;
    const pageSize = Math.min(tickers.length - fullPageSize * page, fullPageSize);
    const totalPage = Math.ceil(tickers.length / fullPageSize);
    const start = page * fullPageSize;
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
            callback_data: `subscribeAlertsFor_${ticker}`,
          };
        })
        .filter((x) => x),
    );

    const navigationButtons = [];
    if (page > 0) {
      navigationButtons.unshift({ text: '<<', callback_data: `loadSubscribePageNo_${page - 1}` });
    }
    if (tickers.length > fullPageSize * page + pageSize) {
      navigationButtons.push({ text: `>>`, callback_data: `loadSubscribePageNo_${page + 1}` });
    }
    inlineKeyboard.push(navigationButtons);

    return inlineKeyboard;
  }

  public async sendMessage(
    chatId: number | string,
    text: string,
    deletionTimerMs: number = -1,
    buttons: TelegramBot.InlineKeyboardButton[][] = [],
  ): Promise<TelegramBot.Message> {
    const options: TelegramBot.SendMessageOptions = {
      reply_markup: {
        inline_keyboard: buttons,
      },
    };

    const res = await this.bot.sendMessage(chatId, text, options);
    await this.deleteMessage(chatId, res.message_id, deletionTimerMs);
    return res;
  }

  public async deleteMessage(chatId: number | string, messageId: number, timeoutMs: number = 0): Promise<void> {
    if (timeoutMs <= 0) {
      return;
    }
    setTimeout(() => this.bot.deleteMessage(chatId, messageId), timeoutMs);
  }

  private getRange(n: number): number[] {
    return Array.from({ length: n }, (_, i) => i);
  }
}
