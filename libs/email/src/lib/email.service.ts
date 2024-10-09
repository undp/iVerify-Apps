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
    const mailingList = process.env.EMAIL_LIST ? process.env.EMAIL_LIST.split(',') : ['admin@iverify-config.org'];
    let env = process.env.ENV === 'prod' ? 'SL' : 'SL - test';
    if(process.env && process.env.EMAIL_SUBJECT_COUNTRY) env = process.env.EMAIL_SUBJECT_COUNTRY;
    await this.mailerService.sendMail({
      to: mailingList,
      from: 'admin@iverify-config.org',
      subject: `Daily iVerify publications - ${env}`,
      text: 'CSV report',
      attachments: [
        {
            filename: `iverify-publications-${date}.csv`,
            content: csv
        },
        ]
    });
  }

  async submittedFactCheckContent(email: string,factCheckedLink:string ): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'NOTIFICATION EMAIL FOR SUBMITTED FACT-CHECKED CONTENT',
        text: `Bonjour,

        Vous avez récemment souscrit à notre service de notifications pour être informé lorsque du contenu est vérifié par l’equipe iVerify.

        Nous vous informons que le contenu que vous aviez signalé ou suivi a été fact-checké. Vous pouvez consulter les résultats de notre analyse en suivant le lien ci-dessous :

        ${factCheckedLink}

        Nous vous remercions pour votre engagement envers la vérification des informations et vous encourageons à partager ces résultats avec vos contacts sur les réseaux sociaux afin de contribuer à la diffusion d'informations fiables.

        Cordialement,
        L’équipe de vérification des faits iVerify`,
    });
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Email sending failed');
    }
  }

}

