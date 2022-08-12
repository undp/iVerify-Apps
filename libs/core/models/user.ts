import {
  BaseModel,
  BaseModelPagedArray,
  BaseModelPagedRequest
} from '../base/base-model';

export interface User extends BaseModel {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  createdBy: Date;
  role: any;
  data?:any;
  roles?:any;
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
  id?: number;
  user_id: number;
  data_source: string,
  type: string;
  contact: string;
}

export interface Users extends BaseModelPagedArray<User> {
  id?: number;
  data?: any;
}

export interface ListUserOptions extends BaseModelPagedRequest {
  role?: string;
  q?: string;
  active?: number;
}
