import { Component, OnInit, } from '@angular/core';
import {RouterLink,RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {
  constructor(private _AuthService:AuthService){}
  isLogin:boolean=false

  ngOnInit(): void {
    this._AuthService.userData.subscribe({
      next:()=>{
        if(this._AuthService.userData.getValue() != null){
          this.isLogin=true
        }else{
          this.isLogin=false
        }
      }
    })
  }

  logout(){
    this._AuthService.logout()
  }

}
