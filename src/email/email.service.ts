import { Injectable, Logger } from '@nestjs/common'; // Import Logger

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  async sendMatchNotification(
    recipientEmail: string,
    projectName: string,
    vendorName: string,
    score: number,
  ): Promise<void> {
    // This is a mock implementation. In a real application, you would integrate with an SMTP service.
    this.logger.log(
      `Sending match notification to ${recipientEmail}: ` +
        `Project "${projectName}" matched with Vendor "${vendorName}" (Score: ${score})`,
    );
    // Simulate async email sending
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}