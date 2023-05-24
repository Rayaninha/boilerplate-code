import {
  IReplyMessageRequest,
  ISendMessageWithButtonTelegram,
  iSendMessageWithoutButton,
} from '../types';

import TelegramBot from 'node-telegram-bot-api';
import signale from 'signale';

interface TelegramProviderProps {
  sendMessageWithButton(
    payload: ISendMessageWithButtonTelegram,
  ): Promise<{ r: boolean; data?: number }>;
  sendMessageWithoutButton(
    payload: iSendMessageWithoutButton,
  ): Promise<{ r: boolean }>;
  replyMessage(
    payload: IReplyMessageRequest,
  ): Promise<{ r: boolean; data?: string }>;
  getChatId(chat: string, token: string): Promise<string>;
  getCountMembers(chatId: string, token: string): Promise<number>;
  deleteMessage(
    chatId: string,
    token: string,
    messageId: string,
  ): Promise<void>;
  sendMessageStartBot(
    channelId: string,
    token: string,
    message: string,
  ): Promise<void>;
}

export class TelegramProvider implements TelegramProviderProps {
  async sendMessageStartBot(
    channelId: string,
    token: string,
    message: string,
  ): Promise<void> {
    try {
      const bot = new TelegramBot(token);

      await bot.sendMessage(channelId, message);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async deleteMessage(
    chatId: string,
    token: string,
    messageId: string,
  ): Promise<void> {
    try {
      const bot = new TelegramBot(token);

      await bot.deleteMessage(chatId, messageId);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async getCountMembers(chatId: string, token: string): Promise<number> {
    try {
      const bot = new TelegramBot(token);

      const result = await bot.getChatMemberCount(chatId);

      return result;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getChatId(chat: string, token: string): Promise<string> {
    try {
      const bot = new TelegramBot(token);

      const result = await bot.getChat(chat);

      return String(result.id);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  replyMessage = async ({
    channelId,
    messageId,
    message,
    token,
  }: IReplyMessageRequest) => {
    try {
      const bot = new TelegramBot(token);

      const result = await bot.sendMessage(channelId, message, {
        reply_to_message_id: messageId,
      });

      return { r: true, data: String(result.message_id) };
      // }
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  sendMessageWithoutButton = async ({
    channelId,
    message,
    token,
  }: iSendMessageWithoutButton): Promise<{ r: boolean; data?: string }> => {
    try {
      const bot = new TelegramBot(token);

      const result = await bot.sendMessage(channelId, message, {
        parse_mode: 'HTML',
      });

      return { r: true, data: String(result.message_id) };
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  sendMessageWithButton = async ({
    channelId,
    message,
    textButton,
    urlButton,
    token,
  }: ISendMessageWithButtonTelegram): Promise<{
    r: boolean;
    data?: number;
  }> => {
    try {
      const bot = new TelegramBot(token);

      const result = await bot.sendMessage(channelId, message, {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: textButton,
                url: urlButton,
              },
            ],
          ],
        },
      });

      return { r: true, data: result.message_id };
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  sendErrorsGroupWatch = async (errors: string[]) => {
    try {
      if (process.env.NODE_ENV === 'development') {
        signale.info(errors.join(' '));
        return { data: { r: true, data: '' } };
      } else {
        const bot = new TelegramBot(
          '6231004372:AAF6JfBSBi_Vmqv4HTJMlaleXp_xOOfnXzg',
        );

        const msg = errors.map((item) => `${item}`).join('\n');

        bot.sendMessage('-1001901371441', msg, { parse_mode: 'HTML' });
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  sendEventsGroupWatch = async (events: string[]) => {
    try {
      if (process.env.NODE_ENV === 'development') {
        signale.info(events.join(' '));
        return { data: { r: true, data: '' } };
      } else {
        const bot = new TelegramBot(
          '6231004372:AAF6JfBSBi_Vmqv4HTJMlaleXp_xOOfnXzg',
        );

        const msg = events.map((item) => `${item}`).join('\n');

        bot.sendMessage('-1001779919483', msg, { parse_mode: 'HTML' });
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  };
}
