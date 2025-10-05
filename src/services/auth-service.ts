import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl:string="http://localhost:3000"
  constructor(public _HttpClient: HttpClient) {
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

  getAuthHeaderOptions(tokenFn:Function): { headers: HttpHeaders } {
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
    return this._HttpClient.post(this.apiUrl+'/api/auth/signup', formdata);
  }

  login(formdata: object): Observable<any> {
    return this._HttpClient.post(this.apiUrl+'/api/auth/login', formdata);
  }


  verifyCode(formdata: object): Observable<any> {
    return this._HttpClient.post(
      this.apiUrl+'/api/auth/verify-code',
      formdata,
      this.getAuthHeaderOptions(this.getVerifyToken)
    );
  }

  resendCode(): Observable<any> {
    return this._HttpClient.get(
      this.apiUrl+'/api/auth/send-code',
      this.getAuthHeaderOptions(this.getVerifyToken)
    );
  }
}
