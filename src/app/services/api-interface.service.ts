import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { StoreService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ApiInterfaceService {

  constructor(private http: HttpClient,
    private storageService: StoreService) {
  }

  post(path: string, body: any, requireAuth = false, params?: any, ignoreURl = false, responseType = false, fullResponse = false) {
    return this.http.post(ignoreURl ? path : "https://shielded-oasis-92105.herokuapp.com/" + path, body, { params, headers: this.generateHeaders(requireAuth) });
  }

  put(path: string, body: any, requireAuth = false, params?: any, responseType = false) {
    return this.http.put("https://shielded-oasis-92105.herokuapp.com/" + path, body, { params, headers: this.generateHeaders(requireAuth) });
  }

  patch(path: string, body: any, requireAuth = false, params?: any) {
    return this.http.patch("https://shielded-oasis-92105.herokuapp.com/" + path, body, { params, headers: this.generateHeaders(requireAuth) });
  }


  get(path: string, requireAuth = false, params?: any, withCredentials?: boolean, responseType = false) {
    const options: {
      headers?: HttpHeaders,
      params?: HttpParams,
      responseType: any,
      withCredentials?: boolean
    } = {
      params,
      headers: this.generateHeaders(requireAuth) as HttpHeaders,
      responseType: responseType ? 'arraybuffer' as const : 'json',
      withCredentials
    };

    return this.http.get("https://shielded-oasis-92105.herokuapp.com/" + path, options);
  }


  delete(path: string, requireAuth = false, params?: any, withCredentials?: boolean) {
    return this.http.delete("https://shielded-oasis-92105.herokuapp.com/" + path, { params, headers: this.generateHeaders(requireAuth), withCredentials });
  }



  generateHeaders(authHeaderRequired: boolean): HttpHeaders {
    debugger
    let header = new HttpHeaders();

    if (authHeaderRequired) {
      const unparsedToken = this.storageService.getItem('JWT_TOKEN').toString();
      console.log('unparsedToken: ', unparsedToken);
      header = header.set('Authorization', "Bearer " + unparsedToken);
    }

    return header;
  }
}
