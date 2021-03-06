import { Injectable 		} from '@angular/core';
import { BaseService 		} from '../../core/base/base-service';
import { Observable 		} from 'rxjs';
import { Users,
		 ListUserOptions, 
		 UserRegistration, 
		 Permission, 
		 Contacts 			} from '../models/user';
import { Roles, RoleItem, RoleRequest, ListRoleOptions	} from '../models/roles';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService {
	readonly uris = {
		list            	: 'users',
		user_extra			: 'users/extra',
		register			: 'users',
		add_role			: 'roles',
		update_role			: 'roles',
		delete_role			: 'roles',
		update_user			: 'users',
		delete_user			: 'users',
		add_permission		: 'permissions',
		update_permission	: 'permissions/:id',
		delete_permission	: 'permissions/:id',
		add_contact			: 'contacts',
		delete_contact		: 'contacts/:id',
		update_contact		: 'contacts/:id',
		export_user			: 'csv/users/export',
		import_user			: 'csv/users/import',
		user_activity   	: 'posts/:user_id/users/audit'
  	};

  list(options: ListUserOptions = null): Observable<Users> {
    return this.http.get<Users>( this.getUrl(this.uris.list), { params: this.getParamsFromObject(options) });
	}
	
	register(body: UserRegistration = null): Observable<Users> {
		return this.http.post<Users>( this.getUrl(this.uris.register), body);
	}

	updateRoles(body: RoleItem, id: number): Observable<Roles> {
		return this.http.put<Roles>( this.getUrl(this.uris.update_role), body, { params: this.getParamsFromObject({roleId: id})});
	}

	getRoles(options: ListRoleOptions = null): Observable<Roles> {
		return this.http.get<Roles>( this.getUrl(this.uris.add_role), { params: this.getParamsFromObject(options)});
	}

	addRoles(body: RoleRequest): Observable<Roles> {
		return this.http.post<Roles>( this.getUrl(this.uris.add_role), body);
	}

	deleteRole(id: number): Observable<Users> {
		return this.http.delete<Users>( this.getUrl(this.uris.delete_role), { params: this.getParamsFromObject({roleId: id})});
	}

	updateUser(body: Users, id: number): Observable<Users> {
		return this.http.put<Users>( this.getUrl(this.uris.update_user), body, { params: this.getParamsFromObject({userId: id})});
	}
	
	deleteUser(id: number): Observable<Users> {
		return this.http.delete<Users>( this.getUrl(this.uris.delete_user), { params: this.getParamsFromObject({userId: id})});
	}

}
