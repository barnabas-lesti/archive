const path = require('path');
const fs = require('fs-extra');
const mailgunJs = require('mailgun-js');

const {
  EMAIL_MAILGUN_API_KEY,
  EMAIL_MAILGUN_DOMAIN,
  EMAIL_FROM_ADDRESS,
  TEMP_FOLDER_PATH,
} = require('../../../../env.config');
const logger = require('../logger');
const { templateNames, templates } = require('./templates');

let mailgun;
if (EMAIL_MAILGUN_API_KEY && EMAIL_MAILGUN_DOMAIN) {
  mailgun = mailgunJs({
    apiKey: EMAIL_MAILGUN_API_KEY,
    domain: EMAIL_MAILGUN_DOMAIN,
  });
  logger.success('Mailgun setup successful');
} else {
  logger.info('EMAIL_MAILGUN_API_KEY and/or EMAIL_MAILGUN_DOMAIN not set, skipping Mailgun setup');
}

class Mail {
  constructor (to, locale, template, templateArgs) {
    const { subject, content } = templates[locale][template](templateArgs);
    this.to = to;
    this.subject = subject;
    this.content = content;
    this.locale = locale;
    this.template = template;
  }

  async send () {
    const data = {
      from: EMAIL_FROM_ADDRESS,
      to: this.to,
      subject: this.subject,
      html: this.content,
    };

    if (mailgun) {
      await mailgun.messages().send(data);
    } else {
      const emailFilePath = path.join(TEMP_FOLDER_PATH, './email', `${this.to}_${this.template}_${this.locale}.html`);
      await fs.outputFile(emailFilePath, data.html);
    }
    return this.content;
  }
}

Mail.Templates = templateNames;

module.exports = Mail;
