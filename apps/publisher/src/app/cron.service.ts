import { HttpException,Injectable} from '@nestjs/common';
import { Cron} from '@nestjs/schedule';
import { AppService } from './app.service';

@Injectable()
export class CronServicePublisher {
  @Cron('0 0 0 * * *', {
    timeZone: process.env.CRON_TIMEZONE || 'UTC'
  })
  async handleCron() {
    const start = new Date();
    const startDate = start.toISOString();
    console.log('Running hourly job',startDate );
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
