import { Component, Input, Output } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'iverify-toast-component',
  template: `
  <div style="position: fixed; top: 50; right: 50; z-index:2000; height: 50px;">
    <ngb-alert
      [type]="config.type"
      [dismissible]="config.dismissible"
      (close)="onClose()"
    >
      {{ config.message | translate }}
    </ngb-alert>
    </div>
  `,
  styleUrls: ['toast.component.scss']
})
export class ToastComponent {
  constructor() {
    this.destroy = new Subject<void>();
  }

  @Input() config: {
    type: ToastType;
    message: string;
    dismissible: boolean;
  };

  @Output() destroy: Subject<void>;

  onClose() {
    this.destroy.next();
  }
}

export enum ToastType {
  Success = 'success',
  Info = 'info',
  Warning = 'warning',
  Danger = 'danger',
  Primary = 'primary',
  Secondary = 'secondary',
  Light = 'light',
  Dark = 'dard'
}
