import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NotificationService } from '../../services/notification-service';
import { ProductModel } from '../../models/product-model';
import { Router, RouterLink } from '@angular/router';
import { CurrencyPipe,DatePipe, NgClass } from '@angular/common';
import { ProductService } from '../../services/product-service';
import { Review,testimonial } from '../../models/review';

@Component({
  selector: 'app-home',
  imports: [CurrencyPipe, RouterLink, NgClass,DatePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  breakpoints = {
    // Mobile devices (<= 767px)
    320: {
      slidesPerView: 1,
      spaceBetween: 10,
    },
    // Tablets (>= 768px)
    768: {
      slidesPerView: 2,
      spaceBetween: 10,
    },
    // Desktops (>= 1024px)
    1024: {
      slidesPerView: 3,
      spaceBetween: 10,
    },
    1280: {
      slidesPerView: 4,
      spaceBetween: 10,
    },
    1580: {
      slidesPerView: 5,
      spaceBetween: 10,
    },
  };
  //for testmoinlaalkflk
  breakpointss = {
    // Mobile devices (<= 767px)
    320: {
      slidesPerView: 1,
      spaceBetween: 10,
    },
    // Tablets (>= 768px)
    768: {
      slidesPerView: 1,
      spaceBetween: 10,
    },
    // Desktops (>= 1024px)
    1024: {
      slidesPerView: 2,
      spaceBetween: 10,
    },
    1280: {
      slidesPerView: 4,
      spaceBetween: 10,
    },
  };

  productsList: ProductModel[] = [];
  productsOffers:ProductModel[]=[]
  testimonials: testimonial[] = [];
  stars: number[] = [1, 2, 3, 4, 5];
  constructor(
    private _ProductService: ProductService,
    private _NotificationService: NotificationService,
    private _Router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.getTestimonials();
    this.loadProductsOffers()
  }

  loadProducts() {
    this._ProductService.getProducts().subscribe({
      next: (data) => {
        this.productsList = data.products;
      },
      error: (e) => {
        this._NotificationService.show('Something wrong', e.name, 'error');
        console.log(e);
      },
    });
  }

  loadProductsOffers(){
    this._ProductService.getOffers().subscribe({
      next: (data) => {
        this.productsOffers = data.productsOffers;
      },
      error: (e) => {
        this._NotificationService.show('Something wrong', e.name, 'error');
        console.log(e);
      },
    });
  }

  getTestimonials() {
    this._ProductService.getTestimonials().subscribe({
      next: (data) => {
        this.testimonials = data.testimonials;
      },
      error: (e) => {
        this._NotificationService.show('Something wrong', e.name, 'error');
        console.log(e);
      },
    });
  }
  details(ID: string) {
    this._Router.navigate(['/menu/' + ID]);
  }
}
