import { Injectable, Inject } from '@angular/core';
import { LOCAL_STORAGE, StorageService as SS } from 'ngx-webstorage-service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor(@Inject(LOCAL_STORAGE) private ss: SS) {}

  get(key: string) {
    return this.ss.get(key);
  }

  set(key: string, value: any) {
    this.ss.set(key, value);
  }

  has(key: string) {
    return this.ss.has(key);
  }

  remove(key: string) {
    this.ss.remove(key);
  }

  clear() {
    this.ss.clear();
  }
}
