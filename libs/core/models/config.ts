import { AllowedPriviledge } from '../auth/auth';
import { BaseModelArray, BaseModel } from '../base/base-model';

export interface Config extends BaseModelArray<ConfigItem> {}

export interface ConfigItem extends BaseModel {}

export class SiteConfigItem implements ConfigItem {
  id = 'site';
}

export class MapConfigItem implements ConfigItem {
  id = 'map';
}

export class FilterConfigItem implements ConfigItem {
  id = 'filters';
}
