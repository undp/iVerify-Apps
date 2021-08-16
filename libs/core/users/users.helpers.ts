import { Users, User } from '../models/user';

const FindUserById = (users: Users, id: number): User =>
  users && users.results ? users.results.find(u => u.id === id) || null : null;

const FormatUserRealname = (user: User): string =>
  user ? user.realname : null;

export const UsersHelpers = {
  FindUserById,
  FormatUserRealname
};
