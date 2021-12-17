export const environment = {
  production: false,
  api: {
    // base: 'http://localhost:8000',
    // base: 'https://api.iverify.org.zm',
    base: 'https://api-iverify-honduras-js-test.rhone.un-icc.cloud',
    version: 'v3'
  },
  authentication: {
    client_id: 'ushahidiui',
    client_secret: '35e7f0bca957836d05ca0492211b0ac707671261',
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
  defaults: {
    tagColor: '#4282c2',
    tagIncidentColor: '#3b746b',
    tagRiskColor: '#27b8ba',
    tagIcon: 'fa fa-map-marker',
    tagType: 'incident'
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
  availableLanguages:[
    "en",
    "es"
  ],
  defaultLanguage: 'es',
  defaultCountryCode: 'HN',
  app_state_key: 'app_storage'
};
