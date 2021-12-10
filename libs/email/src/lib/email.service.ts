import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Article } from '@iverify/iverify-common';
let converter = require('json-2-csv');

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendCsvReport(data: Article[], date: string) {

    // const articles = JSON.stringify(data);
    // const keys = [
    // 'DB Id',
    // 'Meedan Id',
    // 'WP Id',
    // 'Title',
    // 'Content',
    // 'WP Url',
    // 'Publication Date',
    // 'Tags',
    // 'Threat Level',
    // 'type of Violation',
    // 'Claim',
    // 'Rating Justification',
    // 'Evidence and References',
    // 'Mis/Disinfomration Type',
    // 'Hate Speech Type',
    // 'Toxic Score',
    // 'Obscene Score',
    // 'Attack on Identity Score',
    // 'Threat Score',
    // 'Sexually Explicit Score',
    // 'dToxicScore',
    // 'dObsceneScore',
    // 'dIdentityScore',
    // 'dThreatScore',
    // 'dExplicitScore',
    // 'dInsultScore',
    // 'Main Source Name',
    // 'Main Source Url',
    // 'Notes'
    // ]
    const csv = await converter.json2csvAsync(data);
    const msg = `
    `
    await this.mailerService.sendMail({
      to: 'chiodigiovanni1@gmail.com, benet@unicc.org',
      from: 'no_reply@un-icc.cloud',
      subject: 'Daily iVerify publications - Honduras-test',
      text: 'CSV report',
      attachments: [
        {   
            filename: `iverify-publications-${date}.csv`,
            content: csv
        },
        ]
    });
  }
}
