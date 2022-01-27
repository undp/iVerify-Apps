

## Iverify Apps

- Analytic Dashboard
  - Analitic indicators for the iVerify instance
  - To run locally: npx nx serve iverify
- Dashboard API
  - Backend of the analytic dashboard
  - To run locally: npx nx serve api
- Publisher
  - Publishes Meedan Check items on iVerify WordPress
  - To run locally: npx nx serve publisher
- Triage
  - Fetches social media content from CrowdTangle and uploads toxic content on Meeedan Check
  - To run locally: npx nx serve triage

# Configurations

-CHECK_API_URL: url of the Meedan Check instance
-CHECK_API_TOKEN: Meedan Check authentication token
-CHECK_API_TEAM: Meedan Check team's slug
-CHECK_FOLDER_ID: ID of the Meedan Check folder where items from CrowdTangle are loaded
-CHECK_TIPLINE_FOLDER_ID: ID of the Meedan Check folder for items from WordPress tipline

-WP_SECRET: secret token for the authentication of iVerify WordPress on Triage
-WP_URL: url of iVerify WordPress 
-WP_USERNAME: login for iVerify WordPress REST API
-WP_PASSWORD: login for iVerify WordPress REST API
-WP_PUBLISHED_FOLDER: ID of the Meedan Check folder where published items are moved to

-CT_API_URL: CrowdTangle API URL
-CT_API_KEY: CrowdTangle authentication token

-ML_SERVICE_API_BASE: base URL of the Detoxify server
-DETOXIFY_TRESHOLD: toxicity cutoff 

-DB_USER: Database credentials
-DB_PORT: Database credentials
-DB_HOST: Database credentials
-DB_NAME: Database credentials
-DB_PASSWORD: Database credentials

-language: language
-VIOLATION_TASK_ID: ID for task 'Violation Type' on Meedan Check
-UNSTARTED_VALUE: 'value' property of validation statuses on Meedan Check
-IN_PROGRESS_VALUE: 'value' property of validation statuses on Meedan Check
-FALSE_VALUE: 'value' property of validation statuses on Meedan Check
-TRUE_VALUE: 'value' property of validation statuses on Meedan Check
-MISLEADING_VALUE: 'value' property of validation statuses on Meedan Check
-OUT_OF_SCOPE_VALUE: 'value' property of validation statuses on Meedan Check
-PARTLY_FALSE_VALUE: 'value' property of validation statuses on Meedan Check
-INCONCLUSIVE_VALUE: 'value' property of validation statuses on Meedan Check
-PRE_CHECKED_VALUE=: 'value' property of validation statuses on Meedan Check

-API_URL: base url of the Dashboard API

-JWT_SECRET: secrets for Dashboard authentication through iVerify WordPress
-WT_SECRET_TOKEN: secrets for Dashboard authentication through iVerify WordPress
-CLIENT_ID: secrets for Dashboard authentication through iVerify WordPress
-CLIENT_SECRET: secrets for Dashboard authentication through iVerify WordPress
-REDIRECT_URI: secrets for Dashboard authentication through iVerify WordPress

