import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Article } from '@iverify/iverify-common';
let converter = require('json-2-csv');

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendCsvReport(data: Article[]) {

    // const articles = JSON.stringify(data);
    const csv = await converter.json2csvAsync(data);
    await this.mailerService.sendMail({
      to: 'chiodigiovanni1@gmail.com',
      from: 'chiodigiovanni1@gmail.com',
      subject: 'iVerify publications report',
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
