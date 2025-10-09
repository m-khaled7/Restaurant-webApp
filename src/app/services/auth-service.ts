import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../environments/environment.development';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl: string = environment.apiUrl;
  constructor(public _HttpClient: HttpClient, private _Router: Router) {
    if (localStorage.getItem('userToken')) {
      this.saveUserData();
    }
  }
  userData: any = new BehaviorSubject(null);
  saveUserData() {
    let encodedToken = JSON.stringify(localStorage.getItem('userToken'));
    let decodedToken = jwtDecode(encodedToken);
    this.userData.next(decodedToken);
  }

  private getVerifyToken(): string | null {
    return localStorage.getItem('verifyToken');
  }

  getAuthHeaderOptions(tokenFn: Function): { headers: HttpHeaders } {
    const token = tokenFn();

    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
      return { headers: headers };
    }

    return { headers: new HttpHeaders() };
  }

  signup(formdata: object): Observable<any> {
    return this._HttpClient.post(this.apiUrl + '/auth/signup', formdata);
  }

  login(formdata: object): Observable<any> {
    return this._HttpClient.post(this.apiUrl + '/auth/login', formdata);
  }

  verifyCode(formdata: object): Observable<any> {
    return this._HttpClient.post(
      this.apiUrl + '/auth/verify-code',
      formdata,
      this.getAuthHeaderOptions(this.getVerifyToken)
    );
  }

  resendCode(): Observable<any> {
    return this._HttpClient.get(
      this.apiUrl + '/auth/send-code',
      this.getAuthHeaderOptions(this.getVerifyToken)
    );
  }

  logout() {
    localStorage.removeItem('userToken');
    this.userData.next(null);
    this._Router.navigate(['/login']);
  }
  forgetPassword(formdata: object): Observable<any> {
    return this._HttpClient.post(this.apiUrl + '/auth/forgot-password', formdata);
  }
  resetPassword(data: object): Observable<any> {
    return this._HttpClient.post(this.apiUrl + '/auth/reset-password', data);
  }
}
