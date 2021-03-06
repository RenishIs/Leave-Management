import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { StoreService } from './storage.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiInterfaceService {

  constructor(private http: HttpClient,
    private storageService: StoreService) {
  }

  post(path: string, body: any, requireAuth = false, params?: any, ignoreURl = false, responseType = false, fullResponse = false) {
    return this.http.post(ignoreURl ? path : `${environment.apiUrl}` + path, body, { params, headers: this.generateHeaders(requireAuth) });
  }

  put(path: string, body: any, requireAuth = false, params?: any, responseType = false) {
    return this.http.put(`${environment.apiUrl}` + path, body, { params, headers: this.generateHeaders(requireAuth) });
  }

  patch(path: string, body: any, requireAuth = false, params?: any) {
    return this.http.patch(`${environment.apiUrl}` + path, body, { params, headers: this.generateHeaders(requireAuth) });
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

    return this.http.get(`${environment.apiUrl}` + path, options);
  }


  delete(path: string, requireAuth = false, params?: any, withCredentials?: boolean) {
    return this.http.delete(`${environment.apiUrl}` + path, { params, headers: this.generateHeaders(requireAuth), withCredentials });
  }



  generateHeaders(authHeaderRequired: boolean): HttpHeaders {
    let header = new HttpHeaders();

    if (authHeaderRequired) {
      const unparsedToken = this.storageService.getItem('JWT_TOKEN').toString();
      console.log('unparsedToken: ', unparsedToken);
      header = header.set('Authorization', "Bearer " + unparsedToken);
    }

    return header;
  }
}
