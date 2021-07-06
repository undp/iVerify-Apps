export interface Map {
  defaults?: MapContext;
  actual?: MapContext;
  markers?: Marker[];
  regions?: any;
}

export interface Position {
  lat: number;
  lon: number;
  type?: string;
  zoom?: number;
}

export interface MapContext extends Position {
  zoom?: number;
  properties?: any;
}

export interface Marker extends Position {
  parent?: any | { id: number } | { color: string; icon: string };
}
