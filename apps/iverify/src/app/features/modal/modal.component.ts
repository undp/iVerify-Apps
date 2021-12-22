import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
    selector: 'iverify-modal',
    templateUrl: 'modal.component.html',
    styleUrls: ['./modal.component.scss']
  })
  export class ModalComponent  {
    constructor(@Inject(MAT_DIALOG_DATA) public data: any){}

    ngOnInit(){
        console.log('modal is alive...', this.data)
    }
  }