import { Injectable, OnInit } from '@angular/core';
import { AuthService } from './auth-service';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
    apiUrl: string = environment.apiUrl;
  constructor(public _HttpClient: HttpClient) {}
   getProducts(): Observable<any> {
    return this._HttpClient.get(this.apiUrl + '/products');
  }
}
