import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user-service';
import { NotificationService } from '../../services/notification-service';
import { CurrencyPipe } from '@angular/common';


@Component({
  selector: 'app-cart',
  imports: [CurrencyPipe],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart implements OnInit {
  constructor(
    private _UserService: UserService,
    private _NotificationService: NotificationService
  ) {}
  cartItems: any = [];
  ngOnInit(): void {
    this.getItems();
  }

  getItems() {
    this._UserService.getCart().subscribe({
      next: (data) => {
        this.cartItems = data.items;
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

  removeItem(ID: string) {
    this._UserService.deleteCartItem(ID).subscribe({
      next: (data) => {
        this._NotificationService.show('success', data.message, 'success');
        this.getItems();
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

  increaseQuantity(ID: string, quantity: number) {
    let updatedQuantity: number = quantity + 1;
    this._UserService.updateQuantity(ID, updatedQuantity).subscribe({
      next: (data) => {
        this.getItems();
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
  decreaseQuantity(ID: string, quantity: number) {
    if (quantity > 1) {
      let updatedQuantity: number = quantity - 1;
      this._UserService.updateQuantity(ID, updatedQuantity).subscribe({
        next: (data) => {
          this.getItems();
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
  }
}
