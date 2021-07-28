import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastComponent } from './toast.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [TranslateModule, NgbModule, FontAwesomeModule],
  declarations: [ToastComponent],
  entryComponents: [ToastComponent],
  exports: []
})
export class ToastModule {}
