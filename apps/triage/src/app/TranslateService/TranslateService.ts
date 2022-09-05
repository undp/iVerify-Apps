import { TranslateParams } from './interfaces/TranslateParams';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { readdir, readFile } from 'fs/promises';

const getFromBetween = {
  results: [],
  string: '',
  getFromBetween: function (sub1, sub2) {
    if (this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0)
      return false;
    const SP = this.string.indexOf(sub1) + sub1.length;
    const string1 = this.string.substr(0, SP);
    const string2 = this.string.substr(SP);
    const TP = string1.length + string2.indexOf(sub2);
    return this.string.substring(SP, TP);
  },
  removeFromBetween: function (sub1, sub2) {
    if (this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0)
      return false;
    const removal = sub1 + this.getFromBetween(sub1, sub2) + sub2;
    this.string = this.string.replace(removal, '');
  },
  getAllResults: function (sub1, sub2) {
    // first check to see if we do have both substrings
    if (this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return;

    // find one result
    const result = this.getFromBetween(sub1, sub2);
    // push it to the results array
    this.results.push(result);
    // remove the most recently found one from the string
    this.removeFromBetween(sub1, sub2);

    // if there's more substrings
    if (this.string.indexOf(sub1) > -1 && this.string.indexOf(sub2) > -1) {
      this.getAllResults(sub1, sub2);
    } else return;
  },
  get: function (string, sub1, sub2) {
    this.results = [];
    this.string = string;
    this.getAllResults(sub1, sub2);
    return this.results;
  },
};

@Injectable()
export class TranslateService implements OnModuleInit {
  private logger = new Logger(TranslateService.name);

  private translations: Map<string, any> = new Map();

  onModuleInit() {
    this.loadLanguageFiles();
  }

  public async loadLanguageFiles() {
    try {
      const basePath = `${__dirname}/assets/i18n/`;

      const languageFiles = await readdir(basePath);

      const calls = [];

      languageFiles.forEach((filename: string) => {
        const language = filename.split('.')[0];

        // skip ISO 639-2 format
        //   if (language.length > 2 && language.includes('-')) {
        //     language = language.split('-')[0];
        //   }

        calls.push(
          this.setLanguageTranslations(`${basePath}/${filename}`, language),
        );
      });

      return Promise.all(calls);
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  public get(
    key: string,
    lang: string,
    translateParams?: TranslateParams,
  ): string {
    const translateValue = this.translations.get(lang) ?? {};

    let keyValue = key
      .replace(/\[|\]\.?/g, '.')
      .split('.')
      .filter((s) => s)
      .reduce((acc, val) => acc && acc[val], translateValue);

    if (!translateParams || translateParams.params.length === 0) {
      return keyValue;
    }

    const { params } = translateParams;

    const occurrences = getFromBetween
      .get(keyValue, '{{', '}}')
      .map((s) => s.trim());

    occurrences.forEach((paramKey) => {
      const paramValue = params[paramKey];

      keyValue = keyValue.replace(
        new RegExp(`{{ ${paramKey} }}`, 'g'),
        paramValue,
      );
    });

    return keyValue;
  }

  private async readFile(languageFile: string): Promise<string> {
    const result = await readFile(languageFile, 'utf8');

    return JSON.parse(result);
  }

  private async setLanguageTranslations(
    langFile: string,
    language: string,
  ): Promise<void> {
    const languageValues = await this.readFile(langFile);

    this.translations.set(language, languageValues);
  }
}
