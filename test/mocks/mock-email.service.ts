import { Injectable } from '@nestjs/common';

@Injectable()
export class MockEmailService {
  async sendConfirmationEmail(email: string, code: string): Promise<void> {
    console.log(`Sending code ${code} to email ${email}`);
  }

  async sendPasswordRecoveryEmail(email: string, code: string): Promise<void> {
    console.log(`Sending code ${code} to email ${email}`);
  }
}
