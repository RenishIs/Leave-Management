import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private storageService = window.localStorage;

  constructor() {}

  //Set the key,value  on storage service
  public setItem(key, value) {
    value = JSON.stringify(value);
    this.storageService.setItem(key, value);
    return true;
  }
  //Get the key on storage service
  public getItem(key) {
    const value = this.storageService.getItem(key);
    try {
      return JSON.parse(value);
    } catch (e) {
      return null;
    }
  }
//Clear storage service
  public clear() {
    this.storageService.clear();
  }
}
