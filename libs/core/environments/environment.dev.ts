export const environment = {
  production: false,
  api: {
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
    opacity: 0.5,
    spinner: 'skWanderingCubes',
    filteredUrlPatterns: ['open.mapquestapi.com', 'notifications_ex', 'audit', 'comments']
  },
  deploymentName: 'EWER Zambia',
  footer: {
    visible: false,
    text: 'All rights reserved EC-UNDP Joint Task Force',
    links: [
      {
        text: 'Terms of use',
        link: ''
      },
      {
        text: 'Privacy Policy',
        link: ''
      }
    ]
  },
  map: {
    shapeFiles: [
      {
        uri: 'assets/shapefiles/administrative-boundaries-zambia.zip',
        config: [
          {
            fileName: 'Provinces',
            altName: 'Provinces',
            base: true,
            selected: true,
            options: {
              style: {
                color: '#3b746b',
                opacity: '1',
                weight: '4',
                dashArray: ''
              }
            }
          },
          {
            fileName: 'Districts',
            altName: 'Districts',
            base: true,
            selected: true,
            options: {
              style: {
                color: 'green',
                opacity: '1',
                weight: '4',
                dashArray: '1'
              }
            }
          },
          {
            fileName: 'Wards',
            altName: 'Wards',
            base: true,
            selected: true,
            options: {
              style: {
                color: 'grey',
                opacity: '0.5',
                weight: '1',
                dashArray: '2'
              }
            },
            listenForClick: {
              enabled: true,
              dispatchProperties: true
            }
          }
        ]
      }
    ]
  },
  format: {
    date: 'DD/MM/YYYY',
    time: 'HH:mm:ss',
    dateTime: 'DD/MM/YYYY HH:mm:ss',
    dateTimeWithoutSec: 'DD/MM/YYYY HH:mm'
  },
  form: {
    id: 1
  },
  geocoding: {
    provider: 'mapquest',
    mapquest: {
      url: 'https://open.mapquestapi.com/nominatim/v1/search.php',
      key: 'u1eKB28V0nFccp8v96q3Yt8ihTJVAo5P'
    }
  },
  defaults: {
    tagColor: '#4282c2',
    tagIncidentColor: '#3b746b',
    tagRiskColor: '#27b8ba',
    tagIcon: 'fa fa-map-marker',
    tagType: 'incident'
  },
  notifications: {
    enabled: true,
    timing: 900
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
  defaultLanguage: "es",
  defaultCountryCode: 'HN',
  app_state_key: 'app_storage',
  xAxisLabel: 'Report dates',
  yAxisLabel: 'No of reports',
  flexmonster:{
    licenseKey : 'Z7XK-138D18-2L1Y07-6B5L6P-214R57-1N6O3F-0Q5A2P-201L5P-4P2T50-3B1L5P-2J1I0Q-6S6H1U-0A0G26-6C5X2H-0P253X-0E0536'    
  },
  export: {
    timing: 5,
    expoerted_file_name: 'Reports.csv',
    expoerted_user_file_name: 'Users.csv'

  },
  riskMapOptions: [
    {
      name: 'FORECASTED_RISK',
      value: 0,
      isDefault: true
    },
    {
      name: 'EXTENDED_RISK',
      value: 1
    },
    {
      name: 'CURRENT_RISK',
      value: 2
    }
  ],
  mapRefreshInMinutes : 5
};
