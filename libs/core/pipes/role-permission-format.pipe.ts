import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';  

@Pipe({
  name: 'rolePermissionFormat',
  pure: false
})
export class RolePermissionFormatPipe implements PipeTransform {

   constructor(private _sanitizer: DomSanitizer) { }  


  transform(value: string, ...args: unknown[]): unknown {

    const data = JSON.parse(value);
    let newdata = data.map((item: any) => {
      return ' ' + item.name.toUpperCase() + ' : ' + item.permissions;
    });
    return newdata;
  }

}
