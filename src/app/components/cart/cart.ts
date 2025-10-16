import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../../services/user-service';
import { NotificationService } from '../../services/notification-service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { CartModel } from '../../models/cart-model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  imports: [CurrencyPipe, DatePipe, ReactiveFormsModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart implements OnInit, OnDestroy {
  cart: CartModel | null = null;
  date = new Date();
  shippingMethods:any=[]

  private destroy$ = new Subject<void>();

  constructor(
    private _UserService: UserService,
    private _NotificationService: NotificationService,
    private _Router: Router
  ) {}

  orderForm = new FormGroup({
    shippingAddress: new FormControl(null, [Validators.required]),
    paymentMethod: new FormControl(null, [Validators.required]),
    shippingMethodId: new FormControl(null, [Validators.required]),
  });

  get shippingAddress() {
    return this.orderForm.get('shippingAddress');
  }

  get paymentMethod() {
    return this.orderForm.get('paymentMethod');
  }

  get shippingMethodId() {
    return this.orderForm.get('shippingMethodId');
  }

  ngOnInit(): void {
    this._UserService.cart.pipe(takeUntil(this.destroy$)).subscribe((cart: CartModel | null) => {
      this.cart = cart;
    });
    this._UserService.getShippingMethods().subscribe({
      next:(data)=>{this.shippingMethods=data},
      error:(e)=>{console.log(e)}
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  removeItem(id: string): void {
    this._UserService
      .deleteCartItem(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this._NotificationService.show('Success', data.message, 'success');
          this._UserService.loadCart();
        },
        error: (e) => this.handleError(e),
      });
  }

  increaseQuantity(id: string, quantity: number, stock: number): void {
    if (quantity < stock) {
      this.updateQuantity(id, quantity + 1);
    }
  }

  decreaseQuantity(id: string, quantity: number): void {
    if (quantity > 1) {
      this.updateQuantity(id, quantity - 1);
    }
  }

  private updateQuantity(id: string, newQuantity: number): void {
    this._UserService
      .updateQuantity(id, newQuantity)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this._UserService.loadCart(),
        error: (e) => this.handleError(e),
      });
  }

  clearCart(): void {
    if (!this.cart?.items?.length) return;

    this._UserService
      .clearCart()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this._NotificationService.show('Success', data.message, 'success');
          this._UserService.loadCart();
        },
        error: (e) => this.handleError(e),
      });
  }

  details(id: string): void {
    this._Router.navigate(['/menu', id]);
  }

  order(){
    this._Router.navigate(['/order']);
  }

  private handleError(e: any): void {
    const message = e.error?.message || e.message || 'An error occurred';
    this._NotificationService.show('Error', message, 'error');
  }
}
