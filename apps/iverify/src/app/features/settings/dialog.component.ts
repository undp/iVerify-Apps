import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'iverify-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    alert();
  }

}
