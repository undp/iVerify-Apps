import { Config } from '../../../core/models/config';

export interface ConfigState {
  config: Config | null;
}

export const initialConfigState: ConfigState = {
  config: null
};
