import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as nodemailer from 'nodemailer';
import * as path from 'path';

@Injectable()
export class MailsService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendRegistrationEmail(email: string, username: string, token: string) {
    await this.sendEmail(email, 'Добро пожаловать в MyApp!', 'register', {
      username: username,
      activationLink: `${process.env.FRONTEND}/auth/activate/${token}`,
    });
  }

  async sendActivationEmail(email: string, username: string, token: string) {
    await this.sendEmail(email, 'Активация аккаунта MyApp!', 'activation', {
      username: username,
      activationLink: `${process.env.FRONTEND}/auth/activate/${token}`,
    });
  }

  async sendResetPasswordEmail(email: string, username: string, token: string) {
    await this.sendEmail(email, 'Сброс пароля!', 'reset-password', {
      username: username,
      resetLink: `${process.env.FRONTEND}/auth/reset-password/${token}`,
    });
  }

  private async sendEmail(
    to: string,
    subject: string,
    templateName: string,
    variables: Record<string, string>,
  ): Promise<any> {
    const htmlContent = this.loadTemplate(templateName, variables);

    return this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      html: htmlContent,
    });
  }

  private loadTemplate(
    templateName: string,
    variables: Record<string, string>,
  ): string {
    const templatePath = path.join(
      __dirname,
      './',
      'templates',
      `${templateName}.html`,
    );
    let template = fs.readFileSync(templatePath, 'utf8');

    for (const [key, value] of Object.entries(variables)) {
      template = template.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }

    return template;
  }
}
