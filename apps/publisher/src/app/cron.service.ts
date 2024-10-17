import { HttpException,Injectable} from '@nestjs/common';
import { Cron} from '@nestjs/schedule';
import { AppService } from './app.service';

@Injectable()
export class CronServicePublisher {
  // Example cron job that runs every hour
  @Cron('0 30 3 * * *')
  async handleCron() {
    const start = new Date();
    const startDate = start.toISOString();
    console.log('Running hourly job',startDate );
    // Add your custom logic here
    try {
      await this.analyze();
    } catch (error) {
      // this.logger.error(`Failed to run analyze: ${error.message}`, error.stack);
    }
  }

  constructor(private appService: AppService) {}

  private async analyze(): Promise<void> {
    this.appService.notifySubscribers().subscribe({
      next: (created) => {
        console.log('Subscribers notified', created);
      },
      error: (error) => {
        console.error(`Cron job error: ${error.message}`, error.stack);
        throw new HttpException(error.message, 500);
      },
      complete: () => {
        console.log('Notification process completed.');
      },
    });
  }
}
