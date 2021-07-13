import { Body, Controller, Get, HttpException, Logger, Post } from '@nestjs/common';
import { catchError } from 'rxjs/operators';

import { AppService } from './app.service';



@Controller()
export class AppController {
  private readonly logger = new Logger('PublisherAppService');
  
  constructor(private readonly appService: AppService) {}

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
      this.logger.log('body received: ', JSON.stringify(body));
      const parsed = body;
      const event = parsed.event;
      this.logger.log('received event: ', event);
      const data = parsed.data;
      // this.logger.log('body.data: ', data);
      // this.logger.log('type of data: ', typeof data);

      // Object.keys(parsed).forEach(key => this.logger.log('body key', key))
      // Object.keys(data).forEach(key => this.logger.log('data key', key))
      const project_media = data.project_media;
      // Object.keys(project_media).forEach(key => this.logger.log('project_media key', key))
      if(event === 'update_project_media'){
        const id = project_media.dbid;
        this.logger.log('item id: ', id);
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
