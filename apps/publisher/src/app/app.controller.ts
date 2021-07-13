import { MeedanCheckClientService } from '@iverify/meedan-check-client';
import { Body, Controller, Get, HttpException, Logger, Post } from '@nestjs/common';
import { catchError } from 'rxjs/operators';

import { AppService } from './app.service';



@Controller()
export class AppController {
  private readonly logger = new Logger('PublisherAppService');
  
  constructor(private readonly appService: AppService, private checkClient: MeedanCheckClientService) {}

  @Get('alive-test')
  isAlive(){
    return 'I\'m alive...';
  }

  @Post('test-endpoint')
  async publishMeedanReports(@Body() body){
    const id = body['id'];
    return this.appService.publishReportById(id).pipe(
      catchError(err => {
        this.logger.error(err)
        throw new HttpException(err.message, 500);
      })
    );
  }

  @Post('publish-webhook')
  async publishWebHook(@Body() body){
    try{
      // this.logger.log('body received: ', JSON.stringify(body));
      const parsed = body;
      const event = parsed.event;
      this.logger.log('received event: ', event);
      const data = parsed.object;
      const id = data.id;
      const projectId = data.project_id;
      if(event === 'update_project_media' && projectId === process.env.CHECK_FOLDER_ID){
        const query = `query {
          project_media(ids: "${id}"){
            log(event_types: "update_projectmedia", last: 1) {
              edges {
                node {
                  id
                  object_changes_json
                }
              }
            }
            
          }
        }`
        const project_media = await this.checkClient.getReportWithQuery(query).toPromise();
        const logEdges = project_media.log.edges;
        const objectChanges = logEdges.length ? JSON.parse(logEdges[0].node.object_changes_json) : null;
        this.logger.log('object changes: ', objectChanges);
        const folderId = objectChanges && objectChanges['project_id'] ? objectChanges['project_id'][1] : null;
        this.logger.log('folder id: ', folderId);
        const referenceFolderId = process.env.CHECK_FOLDER_ID;
        this.logger.log('reference folder id: ', referenceFolderId);
        if(folderId && folderId === referenceFolderId){
          this.logger.log('publishing post...');
          return this.appService.publishReportById(id).pipe(
            catchError(err => {
              this.logger.error(err);
              throw new HttpException(err.message, 500);
            })
          );
        }
      }
      return null;
    }catch(e){
      this.logger.error(e);
      throw new HttpException(e.message, 500);
    }
  }
}

// example log:
// "log": {
//   "edges": [
//     {
//       "node": {
//         "event_type": "update_projectmedia",
//         "object_changes_json": "{\"project_id\":[null,987]}"
//       }
//     }
//   ]
// }

const json = [
  {
    "event": "update_project_media",
    "team": {
      "dbid": 4610,
      "id": "VGVhbS80NjEw\n",
      "avatar": "https://assets.checkmedia.org/uploads/team/4610/iVerify_Symbol_Square_Logo_2x.png",
      "name": "iVerify Zambia",
      "projects": [
        {
          "dbid": 8159,
          "title": "4 - Report published on Wordpress",
          "id": "UHJvamVjdC84MTU5\n",
          "team": {
            "id": "VGVhbS84MTU5\n",
            "dbid": 4610,
            "avatar": "https://assets.checkmedia.org/uploads/team/4610/iVerify_Symbol_Square_Logo_2x.png",
            "name": "iVerify Zambia",
            "slug": "undp",
            "projects": {
              "edges": [
                {
                  "node": {
                    "dbid": 8159,
                    "title": "4 - Report published on Wordpress",
                    "id": "UHJvamVjdC84MTU5\n"
                  }
                },
                {
                  "node": {
                    "dbid": 8161,
                    "title": "9 - Out of scope",
                    "id": "UHJvamVjdC84MTYx\n"
                  }
                },
                {
                  "node": {
                    "dbid": 8160,
                    "title": "1 a- From Tipline",
                    "id": "UHJvamVjdC84MTYw\n"
                  }
                },
                {
                  "node": {
                    "dbid": 8155,
                    "title": "2 - In Progress",
                    "id": "UHJvamVjdC84MTU1\n"
                  }
                },
                {
                  "node": {
                    "dbid": 8157,
                    "title": "3 - Fact-checked",
                    "id": "UHJvamVjdC84MTU3\n"
                  }
                },
                {
                  "node": {
                    "dbid": 11008,
                    "title": "5 - Report responded",
                    "id": "UHJvamVjdC8xMTAwOA==\n"
                  }
                },
                {
                  "node": {
                    "dbid": 11058,
                    "title": "1 c - From CrowdTangle",
                    "id": "UHJvamVjdC8xMTA1OA==\n"
                  }
                },
                {
                  "node": {
                    "dbid": 11143,
                    "title": "11 - Pre-Checked",
                    "id": "UHJvamVjdC8xMTE0Mw==\n"
                  }
                },
                {
                  "node": {
                    "dbid": 10945,
                    "title": "1 b - From PANOS",
                    "id": "UHJvamVjdC8xMDk0NQ==\n"
                  }
                },
                {
                  "node": {
                    "dbid": 11139,
                    "title": "10 - Relevant for publishing",
                    "id": "UHJvamVjdC8xMTEzOQ==\n"
                  }
                }
              ]
            }
          }
        },
        {
          "dbid": 8161,
          "title": "9 - Out of scope",
          "id": "UHJvamVjdC84MTYx\n",
          "team": {
            "id": "VGVhbS84MTYx\n",
            "dbid": 4610,
            "avatar": "https://assets.checkmedia.org/uploads/team/4610/iVerify_Symbol_Square_Logo_2x.png",
            "name": "iVerify Zambia",
            "slug": "undp",
            "projects": {
              "edges": [
                {
                  "node": {
                    "dbid": 8159,
                    "title": "4 - Report published on Wordpress",
                    "id": "UHJvamVjdC84MTU5\n"
                  }
                },
                {
                  "node": {
                    "dbid": 8161,
                    "title": "9 - Out of scope",
                    "id": "UHJvamVjdC84MTYx\n"
                  }
                },
                {
                  "node": {
                    "dbid": 8160,
                    "title": "1 a- From Tipline",
                    "id": "UHJvamVjdC84MTYw\n"
                  }
                },
                {
                  "node": {
                    "dbid": 8155,
                    "title": "2 - In Progress",
                    "id": "UHJvamVjdC84MTU1\n"
                  }
                },
                {
                  "node": {
                    "dbid": 8157,
                    "title": "3 - Fact-checked",
                    "id": "UHJvamVjdC84MTU3\n"
                  }
                },
                {
                  "node": {
                    "dbid": 11008,
                    "title": "5 - Report responded",
                    "id": "UHJvamVjdC8xMTAwOA==\n"
                  }
                },
                {
                  "node": {
                    "dbid": 11058,
                    "title": "1 c - From CrowdTangle",
                    "id": "UHJvamVjdC8xMTA1OA==\n"
                  }
                },
                {
                  "node": {
                    "dbid": 11143,
                    "title": "11 - Pre-Checked",
                    "id": "UHJvamVjdC8xMTE0Mw==\n"
                  }
                },
                {
                  "node": {
                    "dbid": 10945,
                    "title": "1 b - From PANOS",
                    "id": "UHJvamVjdC8xMDk0NQ==\n"
                  }
                },
                {
                  "node": {
                    "dbid": 11139,
                    "title": "10 - Relevant for publishing",
                    "id": "UHJvamVjdC8xMTEzOQ==\n"
                  }
                }
              ]
            }
          }
        },
        {
          "dbid": 8160,
          "title": "1 a- From Tipline",
          "id": "UHJvamVjdC84MTYw\n",
          "team": {
            "id": "VGVhbS84MTYw\n",
            "dbid": 4610,
            "avatar": "https://assets.checkmedia.org/uploads/team/4610/iVerify_Symbol_Square_Logo_2x.png",
            "name": "iVerify Zambia",
            "slug": "undp",
            "projects": {
              "edges": [
                {
                  "node": {
                    "dbid": 8159,
                    "title": "4 - Report published on Wordpress",
                    "id": "UHJvamVjdC84MTU5\n"
                  }
                },
                {
                  "node": {
                    "dbid": 8161,
                    "title": "9 - Out of scope",
                    "id": "UHJvamVjdC84MTYx\n"
                  }
                },
                {
                  "node": {
                    "dbid": 8160,
                    "title": "1 a- From Tipline",
                    "id": "UHJvamVjdC84MTYw\n"
                  }
                },
                {
                  "node": {
                    "dbid": 8155,
                    "title": "2 - In Progress",
                    "id": "UHJvamVjdC84MTU1\n"
                  }
                },
                {
                  "node": {
                    "dbid": 8157,
                    "title": "3 - Fact-checked",
                    "id": "UHJvamVjdC84MTU3\n"
                  }
                },
                {
                  "node": {
                    "dbid": 11008,
                    "title": "5 - Report responded",
                    "id": "UHJvamVjdC8xMTAwOA==\n"
                  }
                },
                {
                  "node": {
                    "dbid": 11058,
                    "title": "1 c - From CrowdTangle",
                    "id": "UHJvamVjdC8xMTA1OA==\n"
                  }
                },
                {
                  "node": {
                    "dbid": 11143,
                    "title": "11 - Pre-Checked",
                    "id": "UHJvamVjdC8xMTE0Mw==\n"
                  }
                },
                {
                  "node": {
                    "dbid": 10945,
                    "title": "1 b - From PANOS",
                    "id": "UHJvamVjdC8xMDk0NQ==\n"
                  }
                },
                {
                  "node": {
                    "dbid": 11139,
                    "title": "10 - Relevant for publishing",
                    "id": "UHJvamVjdC8xMTEzOQ==\n"
                  }
                }
              ]
            }
          }
        },
        {
          "dbid": 8155,
          "title": "2 - In Progress",
          "id": "UHJvamVjdC84MTU1\n",
          "team": {
            "id": "VGVhbS84MTU1\n",
            "dbid": 4610,
            "avatar": "https://assets.checkmedia.org/uploads/team/4610/iVerify_Symbol_Square_Logo_2x.png",
            "name": "iVerify Zambia",
            "slug": "undp",
            "projects": {
              "edges": [
                {
                  "node": {
                    "dbid": 8159,
                    "title": "4 - Report published on Wordpress",
                    "id": "UHJvamVjdC84MTU5\n"
                  }
                },
                {
                  "node": {
                    "dbid": 8161,
                    "title": "9 - Out of scope",
                    "id": "UHJvamVjdC84MTYx\n"
                  }
                },
                {
                  "node": {
                    "dbid": 8160,
                    "title": "1 a- From Tipline",
                    "id": "UHJvamVjdC84MTYw\n"
                  }
                },
                {
                  "node": {
                    "dbid": 8155,
                    "title": "2 - In Progress",
                    "id": "UHJvamVjdC84MTU1\n"
                  }
                },
                {
                  "node": {
                    "dbid": 8157,
                    "title": "3 - Fact-checked",
                    "id": "UHJvamVjdC84MTU3\n"
                  }
                },
                {
                  "node": {
                    "dbid": 11008,
                    "title": "5 - Report responded",
                    "id": "UHJvamVjdC8xMTAwOA==\n"
                  }
                },
                {
                  "node": {
                    "dbid": 11058,
                    "title": "1 c - From CrowdTangle",
                    "id": "UHJvamVjdC8xMTA1OA==\n"
                  }
                },
                {
                  "node": {
                    "dbid": 11143,
                    "title": "11 - Pre-Checked",
                    "id": "UHJvamVjdC8xMTE0Mw==\n"
                  }
                },
                {
                  "node": {
                    "dbid": 10945,
                    "title": "1 b - From PANOS",
                    "id": "UHJvamVjdC8xMDk0NQ==\n"
                  }
                },
                {
                  "node": {
                    "dbid": 11139,
                    "title": "10 - Relevant for publishing",
                    "id": "UHJvamVjdC8xMTEzOQ==\n"
                  }
                }
              ]
            }
          }
        },
        {
          "dbid": 8157,
          "title": "3 - Fact-checked",
          "id": "UHJvamVjdC84MTU3\n",
          "team": {
            "id": "VGVhbS84MTU3\n",
            "dbid": 4610,
            "avatar": "https://assets.checkmedia.org/uploads/team/4610/iVerify_Symbol_Square_Logo_2x.png",
            "name": "iVerify Zambia",
            "slug": "undp",
            "projects": {
              "edges": [
                {
                  "node": {
                    "dbid": 8159,
                    "title": "4 - Report published on Wordpress",
                    "id": "UHJvamVjdC84MTU5\n"
                  }
                },
                {
                  "node": {
                    "dbid": 8161,
                    "title": "9 - Out of scope",
                    "id": "UHJvamVjdC84MTYx\n"
                  }
                },
                {
                  "node": {
                    "dbid": 8160,
                    "title": "1 a- From Tipline",
                    "id": "UHJvamVjdC84MTYw\n"
                  }
                },
                {
                  "node": {
                    "dbid": 8155,
                    "title": "2 - In Progress",
                    "id": "UHJvamVjdC84MTU1\n"
                  }
                },
                {
                  "node": {
                    "dbid": 8157,
                    "title": "3 - Fact-checked",
                    "id": "UHJvamVjdC84MTU3\n"
                  }
                },
                {
                  "node": {
                    "dbid": 11008,
                    "title": "5 - Report responded",
                    "id": "UHJvamVjdC8xMTAwOA==\n"
                  }
                },
                {
                  "node": {
                    "dbid": 11058,
                    "title": "1 c - From CrowdTangle",
                    "id": "UHJvamVjdC8xMTA1OA==\n"
                  }
                },
                {
                  "node": {
                    "dbid": 11143,
                    "title": "11 - Pre-Checked",
                    "id": "UHJvamVjdC8xMTE0Mw==\n"
                  }
                },
                {
                  "node": {
                    "dbid": 10945,
                    "title": "1 b - From PANOS",
                    "id": "UHJvamVjdC8xMDk0NQ==\n"
                  }
                },
                {
                  "node": {
                    "dbid": 11139,
                    "title": "10 - Relevant for publishing",
                    "id": "UHJvamVjdC8xMTEzOQ==\n"
                  }
                }
              ]
            }
          }
        },
        {
          "dbid": 11008,
          "title": "5 - Report responded",
          "id": "UHJvamVjdC8xMTAwOA==\n",
          "team": {
            "id": "VGVhbS8xMTAwOA==\n",
            "dbid": 4610,
            "avatar": "https://assets.checkmedia.org/uploads/team/4610/iVerify_Symbol_Square_Logo_2x.png",
            "name": "iVerify Zambia",
            "slug": "undp",
            "projects": {
              "edges": [
                {
                  "node": {
                    "dbid": 8159,
                    "title": "4 - Report published on Wordpress",
                    "id": "UHJvamVjdC84MTU5\n"
                  }
                },
                {
                  "node": {
                    "dbid": 8161,
                    "title": "9 - Out of scope",
                    "id": "UHJvamVjdC84MTYx\n"
                  }
                },
                {
                  "node": {
                    "dbid": 8160,
                    "title": "1 a- From Tipline",
                    "id": "UHJvamVjdC84MTYw\n"
                  }
                },
                {
                  "node": {
                    "dbid": 8155,
                    "title": "2 - In Progress",
                    "id": "UHJvamVjdC84MTU1\n"
                  }
                },
                {
                  "node": {
                    "dbid": 8157,
                    "title": "3 - Fact-checked",
                    "id": "UHJvamVjdC84MTU3\n"
                  }
                },
                {
                  "node": {
                    "dbid": 11008,
                    "title": "5 - Report responded",
                    "id": "UHJvamVjdC8xMTAwOA==\n"
                  }
                },
                {
                  "node": {
                    "dbid": 11058,
                    "title": "1 c - From CrowdTangle",
                    "id": "UHJvamVjdC8xMTA1OA==\n"
                  }
                },
                {
                  "node": {
                    "dbid": 11143,
                    "title": "11 - Pre-Checked",
                    "id": "UHJvamVjdC8xMTE0Mw==\n"
                  }
                },
                {
                  "node": {
                    "dbid": 10945,
                    "title": "1 b - From PANOS",
                    "id": "UHJvamVjdC8xMDk0NQ==\n"
                  }
                },
                {
                  "node": {
                    "dbid": 11139,
                    "title": "10 - Relevant for publishing",
                    "id": "UHJvamVjdC8xMTEzOQ==\n"
                  }
                }
              ]
            }
          }
        },
        {
          "dbid": 11058,
          "title": "1 c - From CrowdTangle",
          "id": "UHJvamVjdC8xMTA1OA==\n",
          "team": {
            "id": "VGVhbS8xMTA1OA==\n",
            "dbid": 4610,
            "avatar": "https://assets.checkmedia.org/uploads/team/4610/iVerify_Symbol_Square_Logo_2x.png",
            "name": "iVerify Zambia",
            "slug": "undp",
            "projects": {
              "edges": [
                {
                  "node": {
                    "dbid": 8159,
                    "title": "4 - Report published on Wordpress",
                    "id": "UHJvamVjdC84MTU5\n"
                  }
                },
                {
                  "node": {
                    "dbid": 8161,
                    "title": "9 - Out of scope",
                    "id": "UHJvamVjdC84MTYx\n"
                  }
                },
                {
                  "node": {
                    "dbid": 8160,
                    "title": "1 a- From Tipline",
                    "id": "UHJvamVjdC84MTYw\n"
                  }
                },
                {
                  "node": {
                    "dbid": 8155,
                    "title": "2 - In Progress",
                    "id": "UHJvamVjdC84MTU1\n"
                  }
                },
                {
                  "node": {
                    "dbid": 8157,
                    "title": "3 - Fact-checked",
                    "id": "UHJvamVjdC84MTU3\n"
                  }
                },
                {
                  "node": {
                    "dbid": 11008,
                    "title": "5 - Report responded",
                    "id": "UHJvamVjdC8xMTAwOA==\n"
                  }
                },
                {
                  "node": {
                    "dbid": 11058,
                    "title": "1 c - From CrowdTangle",
                    "id": "UHJvamVjdC8xMTA1OA==\n"
                  }
                },
                {
                  "node": {
                    "dbid": 11143,
                    "title": "11 - Pre-Checked",
                    "id": "UHJvamVjdC8xMTE0Mw==\n"
                  }
                },
                {
                  "node": {
                    "dbid": 10945,
                    "title": "1 b - From PANOS",
                    "id": "UHJvamVjdC8xMDk0NQ==\n"
                  }
                },
                {
                  "node": {
                    "dbid": 11139,
                    "title": "10 - Relevant for publishing",
                    "id": "UHJvamVjdC8xMTEzOQ==\n"
                  }
                }
              ]
            }
          }
        },
        {
          "dbid": 11143,
          "title": "11 - Pre-Checked",
          "id": "UHJvamVjdC8xMTE0Mw==\n",
          "team": {
            "id": "VGVhbS8xMTE0Mw==\n",
            "dbid": 4610,
            "avatar": "https://assets.checkmedia.org/uploads/team/4610/iVerify_Symbol_Square_Logo_2x.png",
            "name": "iVerify Zambia",
            "slug": "undp",
            "projects": {
              "edges": [
                {
                  "node": {
                    "dbid": 8159,
                    "title": "4 - Report published on Wordpress",
                    "id": "UHJvamVjdC84MTU5\n"
                  }
                },
                {
                  "node": {
                    "dbid": 8161,
                    "title": "9 - Out of scope",
                    "id": "UHJvamVjdC84MTYx\n"
                  }
                },
                {
                  "node": {
                    "dbid": 8160,
                    "title": "1 a- From Tipline",
                    "id": "UHJvamVjdC84MTYw\n"
                  }
                },
                {
                  "node": {
                    "dbid": 8155,
                    "title": "2 - In Progress",
                    "id": "UHJvamVjdC84MTU1\n"
                  }
                },
                {
                  "node": {
                    "dbid": 8157,
                    "title": "3 - Fact-checked",
                    "id": "UHJvamVjdC84MTU3\n"
                  }
                },
                {
                  "node": {
                    "dbid": 11008,
                    "title": "5 - Report responded",
                    "id": "UHJvamVjdC8xMTAwOA==\n"
                  }
                },
                {
                  "node": {
                    "dbid": 11058,
                    "title": "1 c - From CrowdTangle",
                    "id": "UHJvamVjdC8xMTA1OA==\n"
                  }
                },
                {
                  "node": {
                    "dbid": 11143,
                    "title": "11 - Pre-Checked",
                    "id": "UHJvamVjdC8xMTE0Mw==\n"
                  }
                },
                {
                  "node": {
                    "dbid": 10945,
                    "title": "1 b - From PANOS",
                    "id": "UHJvamVjdC8xMDk0NQ==\n"
                  }
                },
                {
                  "node": {
                    "dbid": 11139,
                    "title": "10 - Relevant for publishing",
                    "id": "UHJvamVjdC8xMTEzOQ==\n"
                  }
                }
              ]
            }
          }
        },
        {
          "dbid": 10945,
          "title": "1 b - From PANOS",
          "id": "UHJvamVjdC8xMDk0NQ==\n",
          "team": {
            "id": "VGVhbS8xMDk0NQ==\n",
            "dbid": 4610,
            "avatar": "https://assets.checkmedia.org/uploads/team/4610/iVerify_Symbol_Square_Logo_2x.png",
            "name": "iVerify Zambia",
            "slug": "undp",
            "projects": {
              "edges": [
                {
                  "node": {
                    "dbid": 8159,
                    "title": "4 - Report published on Wordpress",
                    "id": "UHJvamVjdC84MTU5\n"
                  }
                },
                {
                  "node": {
                    "dbid": 8161,
                    "title": "9 - Out of scope",
                    "id": "UHJvamVjdC84MTYx\n"
                  }
                },
                {
                  "node": {
                    "dbid": 8160,
                    "title": "1 a- From Tipline",
                    "id": "UHJvamVjdC84MTYw\n"
                  }
                },
                {
                  "node": {
                    "dbid": 8155,
                    "title": "2 - In Progress",
                    "id": "UHJvamVjdC84MTU1\n"
                  }
                },
                {
                  "node": {
                    "dbid": 8157,
                    "title": "3 - Fact-checked",
                    "id": "UHJvamVjdC84MTU3\n"
                  }
                },
                {
                  "node": {
                    "dbid": 11008,
                    "title": "5 - Report responded",
                    "id": "UHJvamVjdC8xMTAwOA==\n"
                  }
                },
                {
                  "node": {
                    "dbid": 11058,
                    "title": "1 c - From CrowdTangle",
                    "id": "UHJvamVjdC8xMTA1OA==\n"
                  }
                },
                {
                  "node": {
                    "dbid": 11143,
                    "title": "11 - Pre-Checked",
                    "id": "UHJvamVjdC8xMTE0Mw==\n"
                  }
                },
                {
                  "node": {
                    "dbid": 10945,
                    "title": "1 b - From PANOS",
                    "id": "UHJvamVjdC8xMDk0NQ==\n"
                  }
                },
                {
                  "node": {
                    "dbid": 11139,
                    "title": "10 - Relevant for publishing",
                    "id": "UHJvamVjdC8xMTEzOQ==\n"
                  }
                }
              ]
            }
          }
        },
        {
          "dbid": 11139,
          "title": "10 - Relevant for publishing",
          "id": "UHJvamVjdC8xMTEzOQ==\n",
          "team": {
            "id": "VGVhbS8xMTEzOQ==\n",
            "dbid": 4610,
            "avatar": "https://assets.checkmedia.org/uploads/team/4610/iVerify_Symbol_Square_Logo_2x.png",
            "name": "iVerify Zambia",
            "slug": "undp",
            "projects": {
              "edges": [
                {
                  "node": {
                    "dbid": 8159,
                    "title": "4 - Report published on Wordpress",
                    "id": "UHJvamVjdC84MTU5\n"
                  }
                },
                {
                  "node": {
                    "dbid": 8161,
                    "title": "9 - Out of scope",
                    "id": "UHJvamVjdC84MTYx\n"
                  }
                },
                {
                  "node": {
                    "dbid": 8160,
                    "title": "1 a- From Tipline",
                    "id": "UHJvamVjdC84MTYw\n"
                  }
                },
                {
                  "node": {
                    "dbid": 8155,
                    "title": "2 - In Progress",
                    "id": "UHJvamVjdC84MTU1\n"
                  }
                },
                {
                  "node": {
                    "dbid": 8157,
                    "title": "3 - Fact-checked",
                    "id": "UHJvamVjdC84MTU3\n"
                  }
                },
                {
                  "node": {
                    "dbid": 11008,
                    "title": "5 - Report responded",
                    "id": "UHJvamVjdC8xMTAwOA==\n"
                  }
                },
                {
                  "node": {
                    "dbid": 11058,
                    "title": "1 c - From CrowdTangle",
                    "id": "UHJvamVjdC8xMTA1OA==\n"
                  }
                },
                {
                  "node": {
                    "dbid": 11143,
                    "title": "11 - Pre-Checked",
                    "id": "UHJvamVjdC8xMTE0Mw==\n"
                  }
                },
                {
                  "node": {
                    "dbid": 10945,
                    "title": "1 b - From PANOS",
                    "id": "UHJvamVjdC8xMDk0NQ==\n"
                  }
                },
                {
                  "node": {
                    "dbid": 11139,
                    "title": "10 - Relevant for publishing",
                    "id": "UHJvamVjdC8xMTEzOQ==\n"
                  }
                }
              ]
            }
          }
        }
      ],
      "slug": "undp"
    },
    "object": {
      "id": 585671,
      "media_id": 569656,
      "created_at": "2021-06-22T06:20:42.528Z",
      "updated_at": "2021-07-13T11:12:35.049Z",
      "user_id": 18088,
      "cached_annotations_count": 81,
      "archived": 0,
      "targets_count": 0,
      "sources_count": 0,
      "team_id": 4610,
      "read": true,
      "source_id": 101160,
      "project_id": 8159,
      "last_seen": 1624342842,
      "full_url": "https://checkmedia.org/undp/project/8159/media/585671"
    },
    "time": "2021-07-13T11:13:02.519+00:00",
    "data": {
      "error": "Error performing GraphQL query"
    },
    "user_id": 18033,
    "settings": "{}"
  }
]
