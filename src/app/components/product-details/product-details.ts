import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from '../../services/notification-service';
import { ProductService } from '../../services/product-service';
import { CurrencyPipe } from '@angular/common';
import { Review } from '../review/review';
import { AuthService } from '../../services/auth-service';
import { UserService } from '../../services/user-service';
import { NgClass } from '@angular/common';


@Component({
  selector: 'app-product-details',
  imports: [CurrencyPipe, Review,NgClass],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails implements OnInit {
  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _ProductService: ProductService,
    private _NotificationService: NotificationService,
    private _Router: Router,
    private _AuthService: AuthService,
    private _UserService: UserService
  ) {}
  productDetails: any;
  similarProducts: any = [];
  isLogin: boolean = false;
  menuOpen = false;
  reviews:any=[]
  stars = [1, 2, 3, 4, 5];
  userData:any={}


  ngOnInit(): void {
    this._ActivatedRoute.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.getData(String(id));
      this.getReviews(String(id));
    });
    this._AuthService.userData.subscribe({
      next: () => {
        if (this._AuthService.userData.getValue() != null) {
          this.isLogin = true;
          this._AuthService.userData.subscribe((data:any)=>this.userData=data)
        } else {
          this.isLogin = false;
        }
      },
    });
    console.log(this.userData)
  }

  getData(ID: string) {
    this._ProductService.productDetails(ID).subscribe({
      next: (data) => {
        this.productDetails = data.product;
        this.similarProducts = data.similarProducts;
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

  getReviews(ID:string){
    this._ProductService.getReviews(ID).subscribe({
      next: (data) => {
          this.reviews=data.reviews
        },
        error: (e) => {
          if (e.error.message) {
            this._NotificationService.show('ERROR', e.error.message, 'error');
          } else {
            this._NotificationService.show(e.name, e.message, 'error');
          }
        },
    })
  }

  details(ID: string) {
    this._Router.navigate(['/menu', ID]);
  }

  handleAddComment(data: { rating: number; comment: string }) {
    if(this.isLogin){
      this._ActivatedRoute.paramMap.subscribe((params) => {
      const id = params.get('id');
      this._UserService.createReview({ productId: id, ...data }).subscribe({
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
    });
    }else {
      this._NotificationService.show('ERROR', 'please Login frist', 'error');
    }
    
  }

  wishlist(prodID: string) {
    if (this.isLogin) {
      this._UserService.addWishlistItem(prodID).subscribe({
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
  cart(prodID: string) {
    if (this.isLogin) {
      this._UserService.addCart(prodID).subscribe({
        next: (data) => {
          this._NotificationService.show('SUCCESS', data.message, 'success');
        },
        error: (e) => {
          console.log(e);
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

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  confirmDelete() {
    const confirmed = confirm('Are you sure you want to delete this comment?');
    if (confirmed) {
    }
    this.menuOpen = false;
  }
}
