import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../environments/environment.development';
import { Router } from '@angular/router';
import {auth} from "../models/auth"

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

  signup(formdata: object): Observable<auth> {
    return this._HttpClient.post<auth>(this.apiUrl + '/auth/signup', formdata);
  }

  login(formdata: object): Observable<auth> {
    return this._HttpClient.post<auth>(this.apiUrl + '/auth/login', formdata);
  }

  verifyCode(formdata: object): Observable<auth> {
    return this._HttpClient.post<auth>(
      this.apiUrl + '/auth/verify-code',
      formdata,
      this.getAuthHeaderOptions(this.getVerifyToken)
    );
  }

  resendCode(): Observable<auth> {
    return this._HttpClient.get<auth>(
      this.apiUrl + '/auth/send-code',
      this.getAuthHeaderOptions(this.getVerifyToken)
    );
  }

  logout() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('user');
    this.userData.next(null);
    this._Router.navigate(['/login']);
  }
  forgetPassword(formdata: object): Observable<auth> {
    return this._HttpClient.post<auth>(this.apiUrl + '/auth/forgot-password', formdata);
  }
  resetPassword(data: object): Observable<auth> {
    return this._HttpClient.post<auth>(this.apiUrl + '/auth/reset-password', data);
  }

}
