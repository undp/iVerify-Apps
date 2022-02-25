## **Index**

* [**Overview**](#overview)
* [**Components**](#components)
* [**Functionalities**](#funcs)
* [**Installation**](#installation)
	* [Pre-requisites](#prereq)
	* [Environment variables](#envs)
	* [Installation and development ](#inst_dev)
* [**API reference**](#api_ref)
* [**Release notes**](#rel_notes)

<a name="overview"></a>
## **Overview** 

iVerifyApps is a set of [Node.js](https://nodejs.org/en/) apps responsible for the integration and data analytics layers in the iVerify toolset. 


<a name="components"></a>
## **Components** 

 
 There are 4 different apps, conveniently held in a single [Nrwl/Nx](https://nx.dev/getting-started/intro) monorepo:
 
*  **api**: the backend for the Dashboard, build with [Nest.js](https://nestjs.com/)
*  **iverify**: the frontend for the Dashboard, built with [Angular](https://angular.io/)
*  **publisher**: a backend app built with [Nest.js](https://nestjs.com/) responsible for publishing data externally (primarily on WordPress)
*  **triage**: a backend app built with [Nest.js](https://nestjs.com/) responsible for the triage of toxic social media content 

Additionally, a **MySql database** is required for persistence.


<a name="funcs"></a>
## **Main functionalities** 


**Integration features:**

The system integrates with the fact-checking portal [Meedan Check](https://meedan.com/check) and provides extra channels both for the publication of fact-checking reports (on WordPress) and the tipline for incoming stories by allowing the public to submit a story trhough the WordPress website. Additionally, the system provides a triaging workflow of toxic social media content by integrating [CrowdTangle](https://www.crowdtangle.com/), Detoxify/[Perspective](https://www.perspectiveapi.com/) and Meedan Check.
	
* Meedan Check - WordPress:
	* Publication on WordPress of Meedan Check reports

		When a fact-checking report is published in Meedan Check, a webhook triggers the publication of a corresponding article on a WordPress site.

	

	![Image](./docs/publication.drawio.svg)

	<br></br>

	* Creation of Meedan Check items from WordPress (story suggestion)

		The WordPress site can also serve as a tipline source for Meedan Check. The public can submit a url for a story to fact-check and a corresponding fact-checking item will be created on Meedan Check. 


		![Image](./docs/submit-a-story.drawio.svg)

	<br></br>


* CrowdTangle - Detoxify/Perspective - Meedan Check: 

	* Based on [CrowdTangle](https://www.crowdtangle.com/) saved searches, the Triage app scans social media content, analyzes it for toxicity using either Detotify or Perspective and finally creates items on [Meedan Check](https://meedan.com/check) if toxicity levels are above the user defined treshold.


	![Image](./docs/triage.drawio.svg)



**Data Analytics:**

The Dashboard front-end offers data visualizations of several indicators giving a pulse of the fact-checking and publication activity. This is achieved by a combination of scheduled jobs that interrogate the Meedan Check DB and webhooks that receive data from Check when something happens (e.g. when an item has changed state Check will notify the **api** server so that it can calculate ticket response and resolution velocity).


![Image](./docs/stats.drawio.svg)

<br></br>



<a name="installation"></a>
## **Installation** 

<a name="prereq"></a>
**Pre-requisites** 

* A working instance of [Meedan Check](https://meedan.com/check) 
* On Meedan Check, there must be [webhooks](https://github.com/meedan/check/wiki/Create-Bots-on-Check) configured to hit these endpoints:
	*  Event `report_published` sends data to the endpoint:  `PUBLISHER_URL/publish/publish-webhook`
	
	*  Event `update_annotation_verification_status` sends data to the endpoint:  `API_URL/stats/item-status-changed`

	Both endpoints receive a minimum payload containing the dbid of the item that triggered the event. iVerifyApps will subsequently fetch the additional data it needs from Meedan Check.
* A WordPress website with [Advanced Custom Fields](https://www.advancedcustomfields.com/) plugin enabled (see [iVerifyWebSite](https://github.com/undp/iVerify-Website) for detailed instructions on how to set up the WordPress site)
* A [CrowdTangle](https://www.crowdtangle.com/) account with Saved Searches and an API token

<a name="envs"></a>
**Environment variables**

The apps need a number of environment variables that can be stored in a single `.env` file at the root of the project. This is the list of the variables needed:

* `CHECK_API_URL`: URL of the Meedan Check instance

- `CHECK_API_TOKEN`: Meedan Check authentication token

- `CHECK_API_TEAM`: Meedan Check team's slug

- `CHECK_FOLDER_ID`: ID of the Meedan Check folder where items from CrowdTangle are loaded

- `CHECK_TIPLINE_FOLDER_ID`: ID of the Meedan Check folder for items from WordPress tipline

- `WP_SECRET`: secret token for the authentication of iVerify WordPress on Triage

- `WP_URL`: url of iVerify WordPress

- `WP_USERNAME`: login for iVerify WordPress REST API

- `WP_PASSWORD`: login for iVerify WordPress REST API

- `WP_PUBLISHED_FOLDER`: ID of the Meedan Check folder where published items are moved to

- `CT_API_URL`: CrowdTangle API URL

- `CT_API_KEY`: CrowdTangle authentication token

- `ML_SERVICE_API_BASE`: base URL of the Detoxify server

- `DETOXIFY_TRESHOLD`: toxicity cutoff

- `DB_USER`: Database credentials

- `DB_PORT`: Database credentials

- `DB_HOST`: Database credentials

- `DB_NAME`: Database credentials

- `DB_PASSWORD`: Database credentials

- `language`: language ('en' or 'es')

- `VIOLATION_TASK_ID`: ID for task 'Violation Type' on Meedan Check

- `UNSTARTED_VALUE`: 'value' property of validation statuses on Meedan Check

- `IN_PROGRESS_VALUE`: 'value' property of validation statuses on Meedan Check

- `FALSE_VALUE`: 'value' property of validation statuses on Meedan Check

- `TRUE_VALUE`: 'value' property of validation statuses on Meedan Check

- `MISLEADING_VALUE`: 'value' property of validation statuses on Meedan Check

- `OUT_OF_SCOPE_VALUE`: 'value' property of validation statuses on Meedan Check

- `PARTLY_FALSE_VALUE`: 'value' property of validation statuses on Meedan Check

- `INCONCLUSIVE_VALUE`: 'value' property of validation statuses on Meedan Check

- `PRE_CHECKED_VALUE`: 'value' property of validation statuses on Meedan Check

- `API_URL`: base url of the Dashboard API

- `JWT_SECRET`: secrets for Dashboard authentication through iVerify WordPress

- `WT_SECRET_TOKEN`: secrets for Dashboard authentication through iVerify WordPress

- `CLIENT_ID`: secrets for Dashboard authentication through iVerify WordPress

- `CLIENT_SECRET`: secrets for Dashboard authentication through iVerify WordPress

- `REDIRECT_URI`: secrets for Dashboard authentication through iVerify WordPressation. 



<a name="inst_dev"></a>
**Installation and development** 

* To install dependencies: `npm i`
* To run **api** locally: `npx nx serve api` 
* To run **iverify** locally: `npx nx serve iverify`
* To run **publisher** locally: `npx nx serve publisher`
* To run **triage** locally: `npx nx serve triage`

<a name="api_ref"></a>
## **Api reference** 

All backend apps have Swagger. To access the API docs go to APP_URL/api.

<a name="rel_notes"></a>
## **Release notes** 