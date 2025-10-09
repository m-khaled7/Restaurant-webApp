import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user-service';
import { AuthService } from '../../services/auth-service';
import { NotificationService } from '../../services/notification-service';

@Component({
  selector: 'app-cart',
  imports: [],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart implements OnInit {
   constructor(
    private _UserService: UserService,
    private _AuthService: AuthService,
    private _NotificationService: NotificationService
  ) {}
  cartItems:any=[]
  ngOnInit(): void {
    this.getItems()
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

}
