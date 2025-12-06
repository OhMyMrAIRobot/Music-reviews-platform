import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as nodemailer from 'nodemailer';
import * as path from 'path';

@Injectable()
export class MailsService {
  /**
   * Nodemailer transporter used to send outgoing email messages.
   *
   * The transporter is created once in the constructor using SMTP
   * configuration sourced from environment variables (`SMTP_USER` and
   * `SMTP_PASS`).
   */
  private transporter: nodemailer.Transporter;

  /**
   * Initialize the mail transporter.
   *
   * The constructor creates a secure SMTP transporter configured for
   * Gmail (port 465). Credentials are read from environment variables.
   * No network requests are performed at construction time — the
   * transporter will attempt connections when `sendMail` is called.
   */
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

  /**
   * Send a registration (welcome) email to a new user.
   *
   * @param email Recipient email address
   * @param username Recipient username for template interpolation
   * @param token Activation token appended to the frontend activation URL
   */
  async sendRegistrationEmail(email: string, username: string, token: string) {
    await this.sendEmail(email, 'Добро пожаловать в MyApp!', 'register', {
      username: username,
      activationLink: `${process.env.FRONTEND}/auth/activate/${token}`,
    });
  }

  /**
   * Send an account activation email.
   *
   * @param email Recipient email address
   * @param username Recipient username used by the template
   * @param token Activation token appended to the frontend activation URL
   */
  async sendActivationEmail(email: string, username: string, token: string) {
    await this.sendEmail(email, 'Активация аккаунта MyApp!', 'activation', {
      username: username,
      activationLink: `${process.env.FRONTEND}/auth/activate/${token}`,
    });
  }

  /**
   * Send a password reset email containing a reset link.
   *
   * @param email Recipient email address
   * @param username Recipient username used by the template
   * @param token Token appended to the frontend reset password URL
   */
  async sendResetPasswordEmail(email: string, username: string, token: string) {
    await this.sendEmail(email, 'Сброс пароля!', 'reset-password', {
      username: username,
      resetLink: `${process.env.FRONTEND}/auth/reset-password/${token}`,
    });
  }

  /**
   * Send a response email for user feedback/messages.
   *
   * Used to notify a user that their message has been replied to by the
   * site administrators. The `sender` and `message` are interpolated into
   * the `response` HTML template.
   *
   * @param email Recipient email address
   * @param sender Name of the reply sender (displayed in template)
   * @param message Reply message body
   */
  async sendResponseEmail(email: string, sender: string, message: string) {
    await this.sendEmail(email, 'Ответ на ваше сообщение', 'response', {
      sender: sender,
      message: message,
    });
  }

  /**
   * Internal helper to send an email using a named HTML template.
   *
   * The method loads the HTML template from `templates/<templateName>.html`,
   * performs simple `{{key}}` replacements from `variables`, and invokes
   * the nodemailer transporter's `sendMail` method.
   *
   * Note: callers should not rely on this method to swallow transport
   * errors — any error thrown by `sendMail` will propagate to the caller.
   *
   * @param to Recipient email address
   * @param subject Email subject (plain text)
   * @param templateName Template filename (without `.html`) located in `templates/`
   * @param variables Key/value pairs used to interpolate the template
   * @returns The result returned by `transporter.sendMail`
   */
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

  /**
   * Load an HTML template from the `templates` directory and interpolate variables.
   *
   * The method reads `templates/<templateName>.html` relative to the service
   * file, replaces `{{key}}` occurrences with the corresponding values from
   * `variables`, and returns the resulting HTML string.
   *
   * @param templateName Template filename (without `.html`)
   * @param variables Key/value pairs to replace in the template
   * @returns Interpolated HTML string
   */
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
