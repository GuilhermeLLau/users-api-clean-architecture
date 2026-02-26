import nodemailer, { Transporter } from "nodemailer";
import {
  IMailProvider,
  IMessage,
} from "../../../domain/shared/mail/mail.gateway";

type SmtpConfig = {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
  secure?: boolean;
};

export class NodeMailerProvider implements IMailProvider {
  private transporter: Transporter;

  private constructor(private readonly config: SmtpConfig) {
    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure ?? false,
      auth: { user: config.user, pass: config.pass },
    });
  }

  public static build(config: SmtpConfig) {
    return new NodeMailerProvider(config);
  }

  async sendMail(message: IMessage): Promise<void> {
    await this.transporter.sendMail({
      from: this.config.from,
      to: message.to,
      subject: message.subject,
      html: message.html,
      text: message.text,
    });
  }
}
