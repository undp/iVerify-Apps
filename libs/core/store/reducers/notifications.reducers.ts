import {
  initialNotificationsState,
  NotificationsState
} from '../states/notifications.state';
import {
  NotificationsActions,
  ENotificationsActions
} from '../actions/notifications.actions';

export function notificationsReducers(
  state = initialNotificationsState,
  action: NotificationsActions
): NotificationsState {
  switch (action.type) {
    case ENotificationsActions.ListNotificationsSuccess: {
      const notifications = action.payload;
      let lastReadId = state.lastReadId;
      if (
        !notifications ||
        (notifications && notifications.results.length === 0)
      ) {
        lastReadId = null;
      }
      let unreadNotifications = false;
      if (notifications && notifications.results && notifications.results[0]) {
        const lastNotification = notifications.results[0];
        unreadNotifications = lastNotification.id !== state.lastReadId;
      }
      return {
        ...state,
        notifications: action.payload,
        lastReadId,
        unreadNotifications
      };
    }

    case ENotificationsActions.ListNotificationsFailure: {
      return {
        ...state,
        notifications: null,
        lastReadId: null,
        unreadNotifications: false
      };
    }

    case ENotificationsActions.ReadNotificationsSaved: {
      const { lastReadId } = action.payload;
      const notifications = state.notifications;
      let unreadNotifications = false;
      if (notifications && notifications.results && notifications.results[0]) {
        const lastNotification = notifications.results[0];
        unreadNotifications = lastNotification.id !== lastReadId;
      }
      return {
        ...state,
        lastReadId,
        unreadNotifications
      };
    }
    default:
      return state;
  }
}
