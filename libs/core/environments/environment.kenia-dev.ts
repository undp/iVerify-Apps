export const environment = {
  production: true,
  api: {
    base: 'https://api-iverify-kenya-js-test.rhone.un-icc.cloud',
    version: 'v3'
  },
  authentication: {
    token_header: 'authorization'
  },
  ngHttpLoaderConfig: {
    backdrop: true,
    backgroundColor: '#000000',
    debounceDelay: 100,
    extraDuration: 500,
    minDuration: 500,
    opacity: '0.5',
    spinner: 'skWanderingCubes',
    filteredUrlPatterns: ['']
  },
  format: {
    date: 'DD/MM/YYYY',
    time: 'HH:mm:ss',
    dateTime: 'DD/MM/YYYY HH:mm:ss',
    dateTimeWithoutSec: 'DD/MM/YYYY HH:mm'
  },
  countryCodes: [
    {
      countryCode: 'en',
      countryLanguage: 'English'
    },
    {
      countryCode: 'es',
      countryLanguage: 'Spanish'
    }
  ],
  availableLanguages: [
    "en",
    "es"
  ],
  defaultLanguage: 'en',
  defaultCountryCode: 'KE',
  app_state_key: 'app_storage',
  defaultCountryName: 'iVerify kenya'
};
