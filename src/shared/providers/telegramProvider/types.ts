export interface ISendMessageWithButtonTelegram {
  channelId: string;
  message: string;
  textButton: string;
  urlButton: string;
  token: string;
}

export interface iSendMessageWithoutButton {
  channelId: string;
  message: string;
  token: string;
}

export interface IReplyMessageRequest {
  messageId: number;
  channelId: string;
  message: string;
  token: string;
}
