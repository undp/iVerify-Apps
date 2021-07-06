import { Injectable } from '@angular/core';
import { environment } from '@eview/core/environments/environment';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { EAppActions, UserLoggedIn } from '../actions/app.actions';
import { GetPermissions, GetRoles } from '../actions/auth.actions';
import { ListFormAttributes } from '../actions/form-attributes.actions';
import { StartNotifications } from '../actions/notifications.actions';
import { ListTags } from '../actions/tags.actions';
import { ListUsers } from '../actions/users.actions';
import { AuthEffects } from './auth.effects';
import { ConfigEffects } from './config.effects';
import { FormAttributesEffects } from './form-attributes.effects';
import { MapEffects } from './map.effects';
import { NotificationsEffects } from './notifications.effects';
import { PermissionsEffects } from './permissions.effects';
import { RolesEffects } from './roles.effects';
import { TagsEffects } from './tags.effects';
import { UsersEffects } from './users.effects';
import { UserExtraEffects } from './user-extra.effects';
import { GetUserExtra} from '@eview/core/store/actions/user-extra.actions';
import { NetworkStatusEffects } from '@eview/core/store/effects/network-status.effects';
import { ExportEffects } from './export.effects';
import { FormsEffects } from './forms.effects';
import { ListForms } from '../actions/forms.actions';


@Injectable()
export class AppEffects {
  constructor(private actions$: Actions) {}

  @Effect()
  userLoggedIn: Observable<any> = this.actions$.pipe(
    ofType<UserLoggedIn>(EAppActions.UserLoggedIn),
    switchMap(payload => [
      new GetPermissions(),
      new GetRoles(),
      new ListUsers(),
      new ListTags(),
      new ListFormAttributes({ id: environment.form.id }),
      new StartNotifications(),
      new GetUserExtra(),
      new ListForms()
    ])
  );
}

export const appEffects = [
  AppEffects,
  AuthEffects,
  ConfigEffects,
  RolesEffects,
  PermissionsEffects,
  MapEffects,
  TagsEffects,
  UsersEffects,
  FormAttributesEffects,
  NotificationsEffects,
  UserExtraEffects,
  NetworkStatusEffects,
  ExportEffects,
  FormsEffects
];
