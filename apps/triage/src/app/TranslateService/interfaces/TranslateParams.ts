export interface TranslateReplace {
  [key: string]: string | number;
}

export interface TranslateParams {
  params: Array<TranslateReplace> | TranslateReplace;
}
