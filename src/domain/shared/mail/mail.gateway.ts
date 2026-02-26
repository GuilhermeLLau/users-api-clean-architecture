export type IMessage = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

export interface IMailProvider {
  sendMail(message: IMessage): Promise<void>;
}
