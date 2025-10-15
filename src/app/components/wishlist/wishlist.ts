import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user-service';
import { NotificationService } from '../../services/notification-service';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';



@Component({
  selector: 'app-wishlist',
  imports: [CurrencyPipe],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.css',
})
export class Wishlist implements OnInit {
  whishlist: any = [];
  count:number=0
  constructor(
    private _UserService: UserService,
    private _NotificationService: NotificationService,
    private _Router:Router
  ) {}
  ngOnInit(): void {
    this._UserService.loadWishlist()
    this._UserService.wishlist.subscribe({
      next:()=>{
        this.whishlist=this._UserService.wishlist.getValue()
      }
    })
  }



  deleteItem(ID: string) {
    this._UserService.deleteWishlistItem(ID).subscribe({
      next: (data) => {
        this._NotificationService.show('success', data.message, 'success');
        this._UserService.loadWishlist()

      },
      error: (e) => {
        if (e.error.message) {
          this._NotificationService.show('ERROR', e.error.message, 'error');
        } else {
          this._NotificationService.show(e.name, e.message, 'error');
        }
      },
    });
  }

  cart(prodID: string) {
    
      this._UserService.addCart(prodID).subscribe({
        next: (data) => {
          this._NotificationService.show('SUCCESS', data.message, 'success');
        },
        error: (e) => {
          if (e.error.message) {
            this._NotificationService.show('ERROR', e.error.message, 'error');
          } else {
            this._NotificationService.show(e.name, e.message, 'error');
          }
        },
      });

  }
    details(ID:string) {
    this._Router.navigate(["/menu/"+ID])
  }
}
