import { Injectable } from "@angular/core";
import { StoreService } from "./storage.service";
import { Router } from "@angular/router";
import { ApiInterfaceService } from "./api-interface.service";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthService {


  //Uses token to uniquely identify 
  token;
  //Property of authservice to check user logout or login 
  isAuthenticated: boolean;
  //return value of authservice
  return: string;
  //Property of authservice token
  JWT_TOKEN = "JWT_TOKEN";
  //Property of authservice user
  APP_USER = "ALBIORIX_USER";

  /**
   * 
   * For check localStorage behaviour 
   */
  localStorageBehaviour = new BehaviorSubject(null);

  constructor(
    private storageService: StoreService,
    private router: Router,
    private api: ApiInterfaceService
  ) {

  }

  public async signIn(email, password): Promise<any> {
    try {
      const res: any = await this.api.post('employee/login', { email, password }, false,).toPromise();
      this.setUserAndToken(res?.data?.token, res?.data, !!res?.data);
      return Promise.resolve(res);
    } catch (e) {
      return Promise.reject(e?.error);
    }
  }

  async register(value: any): Promise<any> {
    try {
      const res: any = await this.api.post('employee/signup', value, false,).toPromise();
      return Promise.resolve(res);
    } catch (e) {
      return Promise.reject(e?.error);
    }
  }


  public signOut() {
    this.setUserAndToken(null, null, false);
    localStorage.clear();
    this.router.navigateByUrl("/login");
  }

  isLoggedIn(): boolean {
    return !!this.getJwtToken();
  }

  getJwtToken() {
    return this.storageService.getItem(this.JWT_TOKEN);
  }

  getUser() {
    return this.storageService.getItem(this.APP_USER);
  }

  setUserAndToken(token: string, user: any, isAuthenticated: boolean) {
    this.isAuthenticated = isAuthenticated;
    this.token = token;
    this.storageService.setItem(this.JWT_TOKEN, token);
    this.storageService.setItem(this.APP_USER, user);
  }

  getLoggedInUserName() {
    const res = this.storageService.getItem(this.APP_USER);
    return res?.firstName + " " + res?.lastName;
  }


}
