import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}
//hbs
  async sendConfirmationEmail(email: string, code: string): Promise<void> {
    this.mailerService.sendMail({
      to: email,
      subject: 'Email confirmation',
      html: `<h1>Thank for your registration</h1>
             <p>To finish registration please follow the link below:
                 <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a>
             </p>`,
    });
  }

  async sendPasswordRecoveryEmail(email: string, code: string): Promise<void> {
    this.mailerService.sendMail({
      to: email,
      subject: 'Password recovery',
      html: `<h1>Thank for your application</h1>
             <p>To recover password please follow the link below:
                 <a href='https://somesite.com/confirm-email?code=${code}'>complete recovery</a>
             </p>`,
    });
  }
}
