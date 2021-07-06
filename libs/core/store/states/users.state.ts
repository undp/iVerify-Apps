import { Users } from '../../../core/models/user';

export interface UsersState {
  users: Users | null;
}

export const initialUsersState: UsersState = {
  users: null
};
