import {
  BaseModel,
  BaseModelPagedArray,
  BaseModelPagedRequest
} from '../base/base-model';

export interface User extends BaseModel {
  id: number;
  email: string;
  realname: string;
  logins: number;
  failed_attempts: number;
  last_login: Date;
  last_attempt: Date;
  created: Date;
  updated: Date;
  role: string;
  language: string;
  contacts: any[];
  gravatar: string;
}

export interface UserRegistration {
  email: string;
  realname: string;
  password: string;
  role: string;
}

export interface Permission {
  id: number,
  name: string,
  description: string
}

export enum ContactType {
  Phone = 'phone',
  Email = 'email',
  Twitter = 'twitter'  
}

export interface Contacts {
  id: number;
  user_id: number;
  data_source: string,
  type: string;
  contact: string;
}

export interface Users extends BaseModelPagedArray<User> {
  id?: number;
}

export interface ListUserOptions extends BaseModelPagedRequest {
  role?: string;
  q?: string;
  active?: number;
}
