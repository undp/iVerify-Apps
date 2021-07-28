import { Roles } from '../../../core/models/roles';

export interface RolesState {
  roles: Roles | null;
}

export const initialRolesState: RolesState = {
  roles: null
};
