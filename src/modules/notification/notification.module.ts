// import { Module } from '@nestjs/common';
// import { MailerModule } from '@nestjs-modules/mailer';
// import { EmailService } from './infrastructure/email.service';
//
// @Module({
//   imports: [
//     MailerModule.forRoot({
//       transport: {
//         host: 'smtp.ethereal.email',
//         port: 587,
//         secure: false,
//         auth: {
//           user: process.env.FROM_EMAIL,
//           pass: process.env.GMAIL_PASSWORD,
//         },
//       },
//       defaults: {
//         from: `"Nest Modules" <${process.env.FROM_EMAIL}>`,
//       },
//     }),
//   ],
//   providers: [EmailService],
//   exports: [EmailService],
// })
// export class NotificationsModule {}
import { CoreConfig } from '../config/core.config';
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from './infrastructure/email.service';
import { CoreModule } from '../config/core.module';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [CoreModule],
      useFactory: (coreConfig: CoreConfig) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: {
            user: coreConfig.gmailName,
            pass: coreConfig.gmailPassword,
          },
        },
        defaults: {
          from: `"Nest Modules" <${coreConfig.gmailName}>`,
        },
      }),
      inject: [CoreConfig],
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class NotificationsModule {}
