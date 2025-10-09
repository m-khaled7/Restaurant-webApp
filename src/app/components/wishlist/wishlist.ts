import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user-service';
import { AuthService } from '../../services/auth-service';
import { NotificationService } from '../../services/notification-service';

@Component({
  selector: 'app-wishlist',
  imports: [],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.css',
})
export class Wishlist implements OnInit {
  isLogin: boolean = false;
  whishlist: any = [];
  constructor(
    private _UserService: UserService,
    private _AuthService: AuthService,
    private _NotificationService: NotificationService
  ) {}
  ngOnInit(): void {
    this._AuthService.userData.subscribe({
      next: () => {
        if (this._AuthService.userData.getValue() != null) {
          this.isLogin = true;
          this.getItems()
        } else {
          this.isLogin = false;
        }
      },
    });
  }

  getItems() {
    this._UserService.getWishlist().subscribe({
      next: (data) => {
        this.whishlist = data.items;
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

  deleteItem(ID: string) {
    this._UserService.deteteWishlistItem(ID).subscribe({
      next: (data) => {
        this._NotificationService.show('success', data.message, 'success');
          this.getItems()

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
    if (this.isLogin) {
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
    } else {
      this._NotificationService.show('ERROR', 'please Login frist', 'error');
    }
  }
}
