import { Component, OnInit, } from '@angular/core';
import {RouterLink,RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { UserService } from '../../services/user-service';
import { NgClass } from '@angular/common';


@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive,NgClass],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {
  constructor(private _AuthService:AuthService,private _UserService:UserService){}
  isLogin:boolean=false
  isOpen: boolean = false;

  user:any={}


  ngOnInit(): void {
    this._AuthService.userData.subscribe({
      next:()=>{
        if(this._AuthService.userData.getValue() != null){
          this.isLogin=true
          this.user=JSON.parse(String(localStorage.getItem('user')))
          this._UserService.loadWishlist()
          this._UserService.loadCart()
        }else{
          this.isLogin=false
          this.user={}
        }
      }
    })
  }

  logout(){
    this._AuthService.logout()
  }

}
