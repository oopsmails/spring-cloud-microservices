import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { OAuthService, AuthConfig } from 'angular-oauth2-oidc';
import { Cookie } from 'ng2-cookies';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

export class Employee {
  constructor(
    public id: string,
    public name: string) { }
}

// export const authConfig: AuthConfig = {
//   issuer: '',
//   redirectUri: window.location.origin + '/home',
//   silentRefreshRedirectUri: window.location.origin + '/assets/silent-refresh.html',
//   clientId: '',
//   dummyClientSecret: '',
//   scope: '',
//   strictDiscoveryDocumentValidation: false,
//   oidc: false
// }

@Injectable()
export class AppService {
  private authServer = 'http://localhost:9999/uaa';
  constructor(
    private _router: Router, private _http: HttpClient, private oauthService: OAuthService) {

      // const authConfig = new AuthConfig();
      // authConfig.issuer = this.authServer + '/oauth/token';
      // authConfig.clientId = 'demops';
      // authConfig.redirectUri = 'http://localhost:4205/';
      // authConfig.scope = 'read write';
      // authConfig.responseType = 'token';
      // this.oauthService.configure(authConfig);
      // this.oauthService.setStorage(sessionStorage);

    this.oauthService.loginUrl = this.authServer + '/oauth/authorize';
    this.oauthService.redirectUri = 'http://localhost:4205/';
    this.oauthService.clientId = 'demops';
    this.oauthService.scope = 'read write';
    this.oauthService.setStorage(sessionStorage);
    this.oauthService.oidc = false;
    this.oauthService.tryLogin({});
  }

  obtainAccessToken() {
    this.oauthService.initImplicitFlow();
  }

  getResource(resourceUrl): Observable<any> {
    const headers = new HttpHeaders({
      'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
      'Authorization': 'Bearer ' + this.oauthService.getAccessToken()
    });
    console.log('headers=', headers);
    return this._http.get(resourceUrl, { headers: headers })
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  isLoggedIn() {
    console.log(this.oauthService.getAccessToken());
    if (this.oauthService.getAccessToken() === null) {
      return false;
    }
    return true;
  }

  logout() {
    this.oauthService.logOut();
    location.reload();
  }

}
