import { createSelector } from '@ngrx/store';
import { AppState } from '../states/app.state';
import { NotificationsState } from '../states/notifications.state';

const notificationsState = (state: AppState) => state.notifications;

export const selectNotifications = createSelector(
  notificationsState,
  (state: NotificationsState) => state.notifications
);

export const selectLastReadId = createSelector(
  notificationsState,
  (state: NotificationsState) => state.lastReadId
);

export const selectUnreadNotifications = createSelector(
  notificationsState,
  (state: NotificationsState) => state.unreadNotifications
);
