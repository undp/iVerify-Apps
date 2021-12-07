import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Article } from '@iverify/iverify-common';
let converter = require('json-2-csv');

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendCsvReport(data: Article[]) {

    const articles = JSON.stringify(data);
    const csv = await converter.json2csvAsync(articles);
    await this.mailerService.sendMail({
      to: 'chiodigiovanni1@gmail.com',
      from: '"Support Team" <support@example.com>',
      subject: 'Welcome to Nice App! Confirm your Email',
      text: 'CSV report',
      attachments: [
        {   
            filename: 'csv.txt',
            content: csv
        },
        ]
    });
  }
}
