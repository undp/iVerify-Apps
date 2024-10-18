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
    const mailingList = process.env.EMAIL_LIST
      ? process.env.EMAIL_LIST.split(',')
      : ['admin@iverify-config.org'];
    let env = process.env.ENV === 'prod' ? 'SL' : 'SL - test';
    if (process.env && process.env.EMAIL_SUBJECT_COUNTRY)
      env = process.env.EMAIL_SUBJECT_COUNTRY;
    await this.mailerService.sendMail({
      to: mailingList,
      from: 'admin@iverify-config.org',
      subject: `Daily iVerify publications - ${env}`,
      text: 'CSV report',
      attachments: [
        {
          filename: `iverify-publications-${date}.csv`,
          content: csv,
        },
      ],
    });
  }

  async submittedFactCheckContent(
    email: string,
    title: string,
    factCheckedLink: string,
    date: string
  ): Promise<void> {
    try {
      let htmlContent = `<div class="">
<div class="aHl"></div>
<div id=":36n" tabindex="-1"></div>
<div
  id=":36d"
  class="ii gt"
  jslog="20277; u014N:xr6bB; 1:WyIjdGhyZWFkLWY6MTgxMjY0MDI5OTA2NzcwNTI3MCJd; 4:WyIjbXNnLWY6MTgxMjY0MDI5OTA2NzcwNTI3MCIsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLDBd"
>
  <div id=":36c" class="a3s aiL msg7366731443651753137">
    <u></u>

    <div
      style="margin: 0; padding: 0; line-height: normal; word-spacing: normal"
      dir="ltr"
    >
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tbody>
          <tr>
            <td bgcolor="#ffffff" valign="top">
              <table
                role="presentation"
                border="0"
                cellpadding="0"
                cellspacing="0"
                align="center"
                width="100%"
                style="border-collapse: collapse; width: 100%"
              >
                <tbody>
                  <tr>
                    <td align="center" style="padding: 0">
                      <table
                        role="presentation"
                        type="options"
                        border="0"
                        cellpadding="0"
                        align="center"
                        cellspacing="0"
                        width="100%"
                        style="
                          border-collapse: separate !important;
                          width: 100% !important;
                          max-width: 600px !important;
                        "
                      >
                        <tbody>
                          <tr>
                            <td
                              align="center"
                              style="
                                text-align: center;
                                line-height: normal !important;
                                letter-spacing: normal;
                                outline: none;
                                padding: 20px 15px 20px 15px;
                                background-color: #ffffff;
                              "
                              bgcolor="#ffffff"
                            >
                              <table
                                width="100%"
                                style="width: 100% !important"
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                              >
                                <tbody>
                                  <tr>
                                    <td
                                      width="100%"
                                      valign="top"
                                      align="left"
                                      class="m_7366731443651753137text"
                                      style="
                                        font-size: 16px;
                                        font-family: Verdana, Geneva,
                                          sans-serif;
                                        font-weight: normal;
                                        color: #222222;
                                        line-height: 1.5;
                                      "
                                    >
                                      <p style="text-align: left">Bonjour,</p>
                                      <p style="text-align: left">&nbsp;</p>
                                      <p style="text-align: left">
                                      Vous avez récemment souscrit à notre service de notifications pour être informé lorsque du contenu est vérifié par l’equipe iVerify.
                                      </p>
                                      <p style="text-align: left">&nbsp;</p>
                                      <p style="text-align: left">
                                      Nous vous informons que le contenu que vous aviez signalé ou suivi a été fact-checké. Vous pouvez consulter les résultats de notre analyse en suivant le lien ci-dessous :
                                      </p>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
              </tbody>
              </table>`;
      htmlContent += ` <div style="text-align: center; font-size: 0">
         <div
           class="m_7366731443651753137max-width-100"
           style="
             width: 100%;
             max-width: 558px;
             display: inline-block;
             vertical-align: top;
             box-sizing: border-box;
           "
         >
           <div style="padding: 10px">
             <table
               border="0"
               cellspacing="0"
               cellpadding="0"
               width="100%"
             >
               <tbody>
                 <tr>
                   <td
                     style="
                       font-size: 14px;
                       font-family: Verdana, Geneva,
                         sans-serif;
                       font-weight: normal;
                       color: #222222;
                       font-style: italic;
                       padding: 0 0 10px 0;
                       line-height: normal !important;
                     "
                     dir="ltr"
                     align="left"
                   >
                   ${date}
                   </td>
                 </tr>

                 <tr>
                   <td
                     align="left"
                     style="padding: 0 0 5px 0"
                   >
                     <a
                       href="${factCheckedLink}"
                       style="
                         font-size: 20px;
                         font-family: Helvetica, Arial,
                           sans-serif;
                         font-weight: bold;
                         color: #222222;
                         line-height: normal !important;
                         text-decoration: none;
                       "
                       dir="ltr"
                       target="_blank"
                       data-saferedirecturl="https://www.google.com/url?q=${factCheckedLink}"
                       >${title}
                     >
                   </td>
                 </tr>

                 <tr>
                   <td
                     align="left"
                     style="padding: 10px 0 15px 0"
                   >
                     <a
                       href="${factCheckedLink}"
                       style="
                         font-size: 16px;
                         font-family: Verdana, Geneva,
                           sans-serif;
                         font-weight: normal;
                         color: #222222;
                         line-height: 1.5 !important;
                         text-decoration: none;
                       "
                       dir="ltr"
                       target="_blank"
                       data-saferedirecturl="https://www.google.com/url?q=${factCheckedLink}"
                     ></a>
                   </td>
                 </tr>

                 <tr>
                   <td
                     align="left"
                     style="padding: 15px 0"
                   >
                     <table
                       border="0"
                       cellpadding="0"
                       cellspacing="0"
                       role="presentation"
                       align="left"
                       style="
                         border-collapse: separate !important;
                         line-height: 100%;
                         width: autopx;
                       "
                     >
                       <tbody>
                         <tr>
                           <td
                             align="center"
                             bgcolor="#0385ca"
                             role="presentation"
                             style="
                               border-collapse: separate !important;
                               background: #0385ca;
                               border-radius: 5px;
                             "
                             valign="middle"
                           >
                             <a
                               href="${factCheckedLink}"
                               style="
                                 display: inline-block;
                                 color: #ffffff;
                                 font-family: Helvetica,
                                   Arial, sans-serif;
                                 font-size: 12px;
                                 font-weight: normal;
                                 line-height: 120%;
                                 margin: 0;
                                 text-decoration: none;
                                 text-transform: none;
                                 padding: 10px 25px;
                                 border-radius: 5px;
                                 width: autopx;
                               "
                               target="_blank"
                               data-saferedirecturl="https://www.google.com/url?q=${factCheckedLink}"
                               >En savoir plus...</a
                             >
                           </td>
                         </tr>
                       </tbody>
                     </table>
                   </td>
                 </tr>
               </tbody>
             </table>
           </div>
         </div>
       </div>`;

      htmlContent += ` <table
              role="presentation"
              border="0"
              cellpadding="0"
              cellspacing="0"
              align="center"
              width="100%"
              style="border-collapse: collapse; width: 100%"
            >
              <tbody>
                <tr>
                  <td align="center" style="padding: 0">
                    <table
                      role="presentation"
                      type="options"
                      border="0"
                      cellpadding="0"
                      align="center"
                      cellspacing="0"
                      width="100%"
                      style="
                        border-collapse: separate !important;
                        width: 100% !important;
                        max-width: 600px !important;
                      "
                    >
                      <tbody>
                        <tr>
                          <td
                            align="center"
                            style="
                              text-align: center;
                              line-height: normal !important;
                              letter-spacing: normal;
                              outline: none;
                              padding: 20px 15px 20px 15px;
                              background-color: #ffffff;
                            "
                            bgcolor="#ffffff"
                          >
                            <table
                              width="100%"
                              style="width: 100% !important"
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    width="100%"
                                    valign="top"
                                    align="left"
                                    class="m_7366731443651753137text"
                                    style="
                                      font-size: 16px;
                                      font-family: Verdana, Geneva,
                                        sans-serif;
                                      font-weight: normal;
                                      color: #222222;
                                      line-height: 1.5;
                                    "
                                  >
                                    <p>
                                    Nous vous remercions pour votre engagement envers la vérification des informations et vous encourageons à partager ces résultats avec vos contacts sur les réseaux sociaux afin de contribuer à la diffusion d'informations fiables.
                                    </p>
                                    <p style="text-align: left">&nbsp;</p>
                                    <p>
                                      Cordialement,<br />L’équipe de
                                      vérification des faits iVerify
                                    </p>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <table
              role="presentation"
              border="0"
              cellpadding="0"
              cellspacing="0"
              align="center"
              width="100%"
              style="border-collapse: collapse; width: 100%"
            >
              <tbody>
                <tr>
                  <td align="center" style="padding: 0">
                    <table
                      role="presentation"
                      type="options"
                      border="0"
                      cellpadding="0"
                      align="center"
                      cellspacing="0"
                      width="100%"
                      style="
                        border-collapse: separate !important;
                        width: 100% !important;
                        max-width: 600px !important;
                      "
                    >
                      <tbody>
                        <tr>
                          <td
                            align="center"
                            style="
                              text-align: center;
                              line-height: normal !important;
                              letter-spacing: normal;
                              outline: none;
                              padding: 20px 20px 20px 20px;
                              background-color: #ffffff;
                            "
                            bgcolor="#ffffff"
                          >
                            <table
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              width="100%"
                              role="presentation"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    style="border-bottom: 1px solid #dddddd"
                                  ></td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <table
              role="presentation"
              border="0"
              cellpadding="0"
              cellspacing="0"
              align="center"
              width="100%"
              style="border-collapse: collapse; width: 100%"
            >
              <tbody>
                <tr>
                  <td align="center" style="padding: 0">
                    <table
                      role="presentation"
                      type="options"
                      border="0"
                      cellpadding="0"
                      align="center"
                      cellspacing="0"
                      width="100%"
                      style="
                        border-collapse: separate !important;
                        width: 100% !important;
                        max-width: 600px !important;
                      "
                    >
                      <tbody>
                        <tr>
                          <td
                            align="center"
                            style="
                              text-align: center;
                              line-height: normal !important;
                              letter-spacing: normal;
                              outline: none;
                              padding: 24px 16px 24px 16px;
                              background-color: #ffffff;
                            "
                            bgcolor="#ffffff"
                          >
                            <table
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              width="100%"
                              role="presentation"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    width="100%"
                                    align="center"
                                    style="padding-bottom: 24px"
                                  >
                                    <a
                                      href="https://rdc.i-verify.org/"
                                      rel="noopener nofollow"
                                      style="
                                        display: inline-block;
                                        font-size: 0;
                                        text-decoration: none;
                                        line-height: normal !important;
                                      "
                                      target="_blank"
                                      data-saferedirecturl="https://www.google.com/url?q=https://rdc.i-verify.org/"
                                      ><img
                                        src="https://ci3.googleusercontent.com/meips/ADKq_NYYMrB3tstWV09WOKKqxsb-tbvs09diYTnp1gn8gGZpl0wV8-8_ie7KDdHrhifrbdI8rU15C9Myh6hYWO2N2Er11c7dNnivvCH0Fy2B2K0Pexp5hzIN-vTKSRJnoUTP5tW2PzV6jmQhQ8DWZwcZbru1RVySnYEvFI8TmyVXgBUZvyzz2kidKdt2ETiyKi9MZJzcfMzkBjwA-wdBg1msY4ZyisZW=s0-d-e1-ft#https://rdc.i-verify.org/wp-content/uploads/2024/09/cropped-Graphic_Republique-Democratique-du-Congo_White_SVG-1-1iVerify_Logo-1.png"
                                        width="120"
                                        height="30"
                                        alt="iVerify RÉPUBLIQUE DÉMOCRATIQUE DU CONGO"
                                        border="0"
                                        style="
                                          display: inline-block;
                                          max-width: 100% !important;
                                          height: auto;
                                          padding: 0;
                                          border: 0;
                                          font-size: 12px;
                                        "
                                        class="CToWUd"
                                        data-bit="iit"
                                    /></a>
                                  </td>
                                </tr>

                                <tr>
                                  <td
                                    width="100%"
                                    align="center"
                                    dir="ltr"
                                    style="padding-bottom: 24px"
                                  >
                                    <a
                                      style="
                                        font-size: 13px;
                                        font-family: Verdana, Geneva,
                                          sans-serif;
                                        font-weight: normal;
                                        color: #222222;
                                        text-decoration: none;
                                        line-height: normal;
                                      "
                                      href="https://rdc.i-verify.org/"
                                      target="_blank"
                                      data-saferedirecturl="https://www.google.com/url?q=https://rdc.i-verify.org/"
                                      >Voir en ligne</a
                                    >
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>

    <img
      width="1"
      height="1"
      alt=""
      src="https://ci3.googleusercontent.com/meips/ADKq_NZvphq6xDO3jYunWUDVEJZ92uZu_LG7JV2vb8sDVdUQSK2XyqgjPzb41FEOeXsZaA_MXm4n58mtw76-xGMKFOHmA4T_24ukVr-51gn5H00SbSB1essLWkSPxfcv0JyIwB8LpUfxbNb6IEp05fGJQKeWk7EaNFYAMn_3hQCRP-t3akOzD9NTe2Kk5tVgzvYDsiVT=s0-d-e1-ft#https://rdc.i-verify.org/"
      class="CToWUd"
      data-bit="iit"
    />
  </div>
  <div class="yj6qo"></div>
  <div class="adL"></div>
</div>
</div>
<div class="WhmR8e" data-hash="0"></div>
      </div>`;
      await this.mailerService.sendMail({
        to: email,
        subject: 'NOTIFICATION EMAIL FOR SUBMITTED FACT-CHECKED CONTENT',
        html: htmlContent,
      });
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Email sending failed');
    }
  }

  async sendEmailForSubscribers(email: string, lists: any): Promise<void> {
    try {
      let htmlContent = `<div class="">
<div class="aHl"></div>
<div id=":36n" tabindex="-1"></div>
<div
  id=":36d"
  class="ii gt"
  jslog="20277; u014N:xr6bB; 1:WyIjdGhyZWFkLWY6MTgxMjY0MDI5OTA2NzcwNTI3MCJd; 4:WyIjbXNnLWY6MTgxMjY0MDI5OTA2NzcwNTI3MCIsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLDBd"
>
  <div id=":36c" class="a3s aiL msg7366731443651753137">
    <u></u>

    <div
      style="margin: 0; padding: 0; line-height: normal; word-spacing: normal"
      dir="ltr"
    >
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tbody>
          <tr>
            <td bgcolor="#ffffff" valign="top">
              <table
                role="presentation"
                border="0"
                cellpadding="0"
                cellspacing="0"
                align="center"
                width="100%"
                style="border-collapse: collapse; width: 100%"
              >
                <tbody>
                  <tr>
                    <td align="center" style="padding: 0">
                      <table
                        role="presentation"
                        type="options"
                        border="0"
                        cellpadding="0"
                        align="center"
                        cellspacing="0"
                        width="100%"
                        style="
                          border-collapse: separate !important;
                          width: 100% !important;
                          max-width: 600px !important;
                        "
                      >
                        <tbody>
                          <tr>
                            <td
                              align="center"
                              style="
                                text-align: center;
                                line-height: normal !important;
                                letter-spacing: normal;
                                outline: none;
                                padding: 20px 15px 20px 15px;
                                background-color: #ffffff;
                              "
                              bgcolor="#ffffff"
                            >
                              <table
                                width="100%"
                                style="width: 100% !important"
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                              >
                                <tbody>
                                  <tr>
                                    <td
                                      width="100%"
                                      valign="top"
                                      align="left"
                                      class="m_7366731443651753137text"
                                      style="
                                        font-size: 16px;
                                        font-family: Verdana, Geneva,
                                          sans-serif;
                                        font-weight: normal;
                                        color: #222222;
                                        line-height: 1.5;
                                      "
                                    >
                                      <p style="text-align: left">Bonjour,</p>
                                      <p style="text-align: left">&nbsp;</p>
                                      <p style="text-align: left">
                                        Merci de vous être abonné à notre
                                        service de notifications pour suivre
                                        les dernières vérifications effectuées
                                        par l’équipe iVerify.
                                      </p>
                                      <p style="text-align: left">&nbsp;</p>
                                      <p style="text-align: left">
                                        Voici les contenus qui ont été
                                        fact-checkés aujourd'hui :
                                      </p>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
              </tbody>
              </table>`;
      for (const list of lists) {
        if (list.thumbnail !== '') {
          htmlContent += `
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center" width="100%" style="border-collapse: collapse; width: 100%">
                    <tbody>
                      <tr>
                        <td align="center" style="padding: 0">
                          <table role="presentation" border="0" cellpadding="0" align="center" cellspacing="0" width="100%" style="border-collapse: separate !important; width: 100% !important; max-width: 600px !important;">
                            <tbody>
                              <tr>
                                <td align="center" style="text-align: center; line-height: normal !important; letter-spacing: normal; outline: none; padding: 15px 15px 15px 15px; background-color: #ffffff;" bgcolor="#ffffff">
                                  <div style="text-align: center; font-size: 0">
                                    <div style="width: 100%; max-width: 274px; display: inline-block; vertical-align: top; box-sizing: border-box;">
                                      <div style="padding: 10px">
                                        <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                          <tbody>
                                            <tr>
                                              <td style="padding-bottom: 20px" width="100%">
                                                <a href="${list.link}" rel="noopener nofollow" style="display: inline-block; font-size: 0; text-decoration: none; line-height: normal !important;" target="_blank">
                                                  <img src="${list.thumbnail}" width="275" height="125" alt="" border="0" style="display: inline-block; max-width: 100% !important; height: auto; padding: 0; border: 0; font-size: 12px;" class="m_7366731443651753137fluid CToWUd" data-bit="iit" />
                                                </a>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                    <div style="width: 100%; max-width: 274px; display: inline-block; vertical-align: top; box-sizing: border-box;">
                                      <div style="padding: 10px">
                                        <table border="0" cellspacing="0" cellpadding="0" width="100%">
                                          <tbody>
                                            <tr>
                                              <td style="font-size: 14px; font-family: Verdana, Geneva, sans-serif; font-weight: normal; color: #222222; font-style: italic; padding: 0 0 10px 0; line-height: normal !important;" dir="ltr" align="left">
                                                ${list.date}
                                              </td>
                                            </tr>
                                            <tr>
                                              <td align="left" style="padding: 0 0 5px 0">
                                                <a href="${list.link}" style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; font-weight: bold; color: #222222; line-height: normal !important; text-decoration: none;" dir="ltr" target="_blank">
                                                  ${list.title}
                                                </a>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td align="left" style="padding: 15px 0">
                                                <table border="0" cellpadding="0" cellspacing="0" role="presentation" align="left" style="border-collapse: separate !important; line-height: 100%; width: auto;">
                                                  <tbody>
                                                    <tr>
                                                      <td align="center" bgcolor="#0385ca" role="presentation" style="border-collapse: separate !important; background: #0385ca; border-radius: 5px;" valign="middle">
                                                        <a href="${list.link}" style="display: inline-block; color: #ffffff; font-family: Helvetica, Arial, sans-serif; font-size: 12px; font-weight: normal; line-height: 120%; margin: 0; text-decoration: none; text-transform: none; padding: 10px 25px; border-radius: 5px; width: auto;" target="_blank">
                                                          En savoir plus...
                                                        </a>
                                                      </td>
                                                    </tr>
                                                  </tbody>
                                                </table>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
          </table>`;
        } else {
          htmlContent += ` <div style="text-align: center; font-size: 0">
         <div
           class="m_7366731443651753137max-width-100"
           style="
             width: 100%;
             max-width: 558px;
             display: inline-block;
             vertical-align: top;
             box-sizing: border-box;
           "
         >
           <div style="padding: 10px">
             <table
               border="0"
               cellspacing="0"
               cellpadding="0"
               width="100%"
             >
               <tbody>
                 <tr>
                   <td
                     style="
                       font-size: 14px;
                       font-family: Verdana, Geneva,
                         sans-serif;
                       font-weight: normal;
                       color: #222222;
                       font-style: italic;
                       padding: 0 0 10px 0;
                       line-height: normal !important;
                     "
                     dir="ltr"
                     align="left"
                   >
                   ${list.date}
                   </td>
                 </tr>

                 <tr>
                   <td
                     align="left"
                     style="padding: 0 0 5px 0"
                   >
                     <a
                       href="${list.link}"
                       style="
                         font-size: 20px;
                         font-family: Helvetica, Arial,
                           sans-serif;
                         font-weight: bold;
                         color: #222222;
                         line-height: normal !important;
                         text-decoration: none;
                       "
                       dir="ltr"
                       target="_blank"
                       data-saferedirecturl="https://www.google.com/url?q=${list.link}"
                       >${list.title}
                     >
                   </td>
                 </tr>

                 <tr>
                   <td
                     align="left"
                     style="padding: 10px 0 15px 0"
                   >
                     <a
                       href="${list.link}"
                       style="
                         font-size: 16px;
                         font-family: Verdana, Geneva,
                           sans-serif;
                         font-weight: normal;
                         color: #222222;
                         line-height: 1.5 !important;
                         text-decoration: none;
                       "
                       dir="ltr"
                       target="_blank"
                       data-saferedirecturl="https://www.google.com/url?q=${list.link}"
                     ></a>
                   </td>
                 </tr>

                 <tr>
                   <td
                     align="left"
                     style="padding: 15px 0"
                   >
                     <table
                       border="0"
                       cellpadding="0"
                       cellspacing="0"
                       role="presentation"
                       align="left"
                       style="
                         border-collapse: separate !important;
                         line-height: 100%;
                         width: autopx;
                       "
                     >
                       <tbody>
                         <tr>
                           <td
                             align="center"
                             bgcolor="#0385ca"
                             role="presentation"
                             style="
                               border-collapse: separate !important;
                               background: #0385ca;
                               border-radius: 5px;
                             "
                             valign="middle"
                           >
                             <a
                               href="${list.link}"
                               style="
                                 display: inline-block;
                                 color: #ffffff;
                                 font-family: Helvetica,
                                   Arial, sans-serif;
                                 font-size: 12px;
                                 font-weight: normal;
                                 line-height: 120%;
                                 margin: 0;
                                 text-decoration: none;
                                 text-transform: none;
                                 padding: 10px 25px;
                                 border-radius: 5px;
                                 width: autopx;
                               "
                               target="_blank"
                               data-saferedirecturl="https://www.google.com/url?q=${list.link}"
                               >En savoir plus...</a
                             >
                           </td>
                         </tr>
                       </tbody>
                     </table>
                   </td>
                 </tr>
               </tbody>
             </table>
           </div>
         </div>
       </div>`;
        }
      }

      htmlContent += ` <table
              role="presentation"
              border="0"
              cellpadding="0"
              cellspacing="0"
              align="center"
              width="100%"
              style="border-collapse: collapse; width: 100%"
            >
              <tbody>
                <tr>
                  <td align="center" style="padding: 0">
                    <table
                      role="presentation"
                      type="options"
                      border="0"
                      cellpadding="0"
                      align="center"
                      cellspacing="0"
                      width="100%"
                      style="
                        border-collapse: separate !important;
                        width: 100% !important;
                        max-width: 600px !important;
                      "
                    >
                      <tbody>
                        <tr>
                          <td
                            align="center"
                            style="
                              text-align: center;
                              line-height: normal !important;
                              letter-spacing: normal;
                              outline: none;
                              padding: 20px 15px 20px 15px;
                              background-color: #ffffff;
                            "
                            bgcolor="#ffffff"
                          >
                            <table
                              width="100%"
                              style="width: 100% !important"
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    width="100%"
                                    valign="top"
                                    align="left"
                                    class="m_7366731443651753137text"
                                    style="
                                      font-size: 16px;
                                      font-family: Verdana, Geneva,
                                        sans-serif;
                                      font-weight: normal;
                                      color: #222222;
                                      line-height: 1.5;
                                    "
                                  >
                                    <p>
                                      Nous vous remercions pour votre
                                      engagement dans la lutte contre la
                                      désinformation et vous invitons à
                                      partager ces résultats sur vos réseaux
                                      sociaux pour contribuer à la diffusion
                                      d'informations fiables.
                                    </p>
                                    <p style="text-align: left">&nbsp;</p>
                                    <p>
                                      Cordialement,<br />L’équipe de
                                      vérification des faits iVerify
                                    </p>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <table
              role="presentation"
              border="0"
              cellpadding="0"
              cellspacing="0"
              align="center"
              width="100%"
              style="border-collapse: collapse; width: 100%"
            >
              <tbody>
                <tr>
                  <td align="center" style="padding: 0">
                    <table
                      role="presentation"
                      type="options"
                      border="0"
                      cellpadding="0"
                      align="center"
                      cellspacing="0"
                      width="100%"
                      style="
                        border-collapse: separate !important;
                        width: 100% !important;
                        max-width: 600px !important;
                      "
                    >
                      <tbody>
                        <tr>
                          <td
                            align="center"
                            style="
                              text-align: center;
                              line-height: normal !important;
                              letter-spacing: normal;
                              outline: none;
                              padding: 20px 20px 20px 20px;
                              background-color: #ffffff;
                            "
                            bgcolor="#ffffff"
                          >
                            <table
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              width="100%"
                              role="presentation"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    style="border-bottom: 1px solid #dddddd"
                                  ></td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <table
              role="presentation"
              border="0"
              cellpadding="0"
              cellspacing="0"
              align="center"
              width="100%"
              style="border-collapse: collapse; width: 100%"
            >
              <tbody>
                <tr>
                  <td align="center" style="padding: 0">
                    <table
                      role="presentation"
                      type="options"
                      border="0"
                      cellpadding="0"
                      align="center"
                      cellspacing="0"
                      width="100%"
                      style="
                        border-collapse: separate !important;
                        width: 100% !important;
                        max-width: 600px !important;
                      "
                    >
                      <tbody>
                        <tr>
                          <td
                            align="center"
                            style="
                              text-align: center;
                              line-height: normal !important;
                              letter-spacing: normal;
                              outline: none;
                              padding: 24px 16px 24px 16px;
                              background-color: #ffffff;
                            "
                            bgcolor="#ffffff"
                          >
                            <table
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              width="100%"
                              role="presentation"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    width="100%"
                                    align="center"
                                    style="padding-bottom: 24px"
                                  >
                                    <a
                                      href="https://rdc.i-verify.org/"
                                      rel="noopener nofollow"
                                      style="
                                        display: inline-block;
                                        font-size: 0;
                                        text-decoration: none;
                                        line-height: normal !important;
                                      "
                                      target="_blank"
                                      data-saferedirecturl="https://www.google.com/url?q=https://rdc.i-verify.org/"
                                      ><img
                                        src="https://ci3.googleusercontent.com/meips/ADKq_NYYMrB3tstWV09WOKKqxsb-tbvs09diYTnp1gn8gGZpl0wV8-8_ie7KDdHrhifrbdI8rU15C9Myh6hYWO2N2Er11c7dNnivvCH0Fy2B2K0Pexp5hzIN-vTKSRJnoUTP5tW2PzV6jmQhQ8DWZwcZbru1RVySnYEvFI8TmyVXgBUZvyzz2kidKdt2ETiyKi9MZJzcfMzkBjwA-wdBg1msY4ZyisZW=s0-d-e1-ft#https://rdc.i-verify.org/wp-content/uploads/2024/09/cropped-Graphic_Republique-Democratique-du-Congo_White_SVG-1-1iVerify_Logo-1.png"
                                        width="120"
                                        height="30"
                                        alt="iVerify RÉPUBLIQUE DÉMOCRATIQUE DU CONGO"
                                        border="0"
                                        style="
                                          display: inline-block;
                                          max-width: 100% !important;
                                          height: auto;
                                          padding: 0;
                                          border: 0;
                                          font-size: 12px;
                                        "
                                        class="CToWUd"
                                        data-bit="iit"
                                    /></a>
                                  </td>
                                </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>

    <img
      width="1"
      height="1"
      alt=""
      src="https://ci3.googleusercontent.com/meips/ADKq_NZvphq6xDO3jYunWUDVEJZ92uZu_LG7JV2vb8sDVdUQSK2XyqgjPzb41FEOeXsZaA_MXm4n58mtw76-xGMKFOHmA4T_24ukVr-51gn5H00SbSB1essLWkSPxfcv0JyIwB8LpUfxbNb6IEp05fGJQKeWk7EaNFYAMn_3hQCRP-t3akOzD9NTe2Kk5tVgzvYDsiVT=s0-d-e1-ft#https://rdc.i-verify.org/"
      class="CToWUd"
      data-bit="iit"
    />
  </div>
  <div class="yj6qo"></div>
  <div class="adL"></div>
</div>
</div>
<div class="WhmR8e" data-hash="0"></div>
      </div>`;
      await this.mailerService.sendMail({
        bcc: email,
        subject: 'DAILY FACT-CHECKED CONTENT NOTIFICATION',
        html: htmlContent,
      });

      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Email sending failed');
    }
  }
}
