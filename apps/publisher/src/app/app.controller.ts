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
      const parsed = JSON.parse(body)
      const event = parsed.event;
      const id = parsed.data.project_media.id;
      const logEdges = parsed.data.project_media.log.edges;
      const objectChanges = logEdges.length ? JSON.parse(logEdges[0].node.object_changes_json) : null;
      const folderId = objectChanges && objectChanges['project_id'] ? objectChanges['project_id'][1] : null
      if(event === 'update_projectmedia' && folderId && folderId === process.env.CHECK_FOLDER_ID){
        return this.appService.publishReportById(id).pipe(
          catchError(err => {
            throw new HttpException(err.message, 500);
          })
        );
      } else {
        return null
      }
    }catch(e){
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
