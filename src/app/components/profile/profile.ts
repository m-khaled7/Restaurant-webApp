import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  user: any = {};

  constructor(private _AuthService: AuthService) {}

  ngOnInit() {
    this.user = JSON.parse(String(localStorage.getItem('user')));
  }

  signout() {
    this._AuthService.logout();
  }
}
