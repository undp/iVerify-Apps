import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';  

@Pipe({
  name: 'rolePermissionFormat',
  pure: false
})
export class RolePermissionFormatPipe implements PipeTransform {

   constructor(private _sanitizer: DomSanitizer) { }  


  transform(value: string, ...args: unknown[]): unknown {
    const data = JSON.parse(value); let formattedData: string = '';
    data.map((item: any) => {
      let htmlData: string[] = [];
      item.permissions.map((item: string) => {
        htmlData.push(item);
      });
      formattedData += this.capitalizeFirstLetter(item.name) + ' : ' + htmlData.join() + '</br>';
    });
    return formattedData;
  }

  capitalizeFirstLetter(textString: string) {
    if (textString.length > 0) {
      return textString.charAt(0).toUpperCase() + textString.slice(1);
    }
    return textString;
  }

}
