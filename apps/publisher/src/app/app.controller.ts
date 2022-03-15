import { Body, Controller, Get, HttpException, Post } from '@nestjs/common';
import { of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { AppService } from './app.service';

@Controller()
export class AppController {
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
        console.log(err)
        throw new HttpException(err.message, 500);
      })
    );
  }

  @Post('publish-webhook')
  async publishWebHook(@Body() body){
    try{
      this.logger.log('body received: ', body);
      const parsed = body;
      const event = parsed.event;
      console.log('received event: ', event);
      if(event === 'update_projectmedia'){
        const id = parsed.data.project_media.id;
        console.log('item id: ', id);
        const logEdges = parsed.data.project_media.log.edges;
        const objectChanges = logEdges.length ? JSON.parse(logEdges[0].node.object_changes_json) : null;
        console.log('object changes: ', objectChanges);
        const folderId = objectChanges && objectChanges['project_id'] ? objectChanges['project_id'][1] : null;
        console.log('folder id: ', folderId);
        const referenceFolderId = process.env.CHECK_FOLDER_ID;
        console.log('reference folder id: ', referenceFolderId);
        if(folderId && folderId === referenceFolderId){
          console.log('publishing post...');
          return this.appService.publishReportById(id).pipe(
            catchError(err => {
              throw new HttpException(err.message, 500);
            })
          );
        }
      }
      return null;
    }catch(e){
      throw new HttpException(e.message, 500);
    }
  }

  @Post('publish-test-endpoint')
  async punlishTestEndpoint(@Body() body){
    try{
      const id = body.id;
      this.logger.log(`project media id: ${id}`)
      return this.appService.publishReportById(id).pipe(
        tap(() => this.logger.log('Report published.')),
        catchError(err => {
          this.logger.error(err);
          throw new HttpException(err.message, 500);
        })
      );      
    }catch(e){
      return new HttpException(e.message, 500)
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
