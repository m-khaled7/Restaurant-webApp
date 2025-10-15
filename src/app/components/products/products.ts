import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from '../../services/product-service';
import { NotificationService } from '../../services/notification-service';
import { AuthService } from '../../services/auth-service';
import { UserService } from '../../services/user-service';
import { CurrencyPipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, of } from 'rxjs';

import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  takeUntil,
  catchError,
} from 'rxjs/operators';
import { NgClass } from '@angular/common';

export interface Product {
  _id: string;
  name: string;
  price: number;
  subcategoryId: string;
  image: string[]; // array of image URLs or paths
  sizes: string[]; // array of size options
  description: string;
  offerId: string;
  discountedPrice: number;
  quantity: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
}

@Component({
  selector: 'app-products',
  imports: [CurrencyPipe, ReactiveFormsModule, NgClass],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit {
  form: FormGroup;
  private destroy$ = new Subject<void>();
  wishlistIDs: Set<string> = new Set();
  productsList: Product[] = [];
  subcategories:any[]=[]
  isLogin: boolean = false;
  isFilterOpen: boolean = false;

  constructor(
    private _ProductService: ProductService,
    private _NotificationService: NotificationService,
    private _AuthService: AuthService,
    private _UserService: UserService,
    private _Router: Router,
    private _ActivatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      search: [''],
      min: [''],
      max: [''],
      subcategoryId: [''],
      sizes: [[]],
      page: [1],
      limit: [20],
    });
  }

  ngOnInit(): void {
    this._AuthService.userData.subscribe({
      next: () => {
        if (this._AuthService.userData.getValue() != null) {
          this.isLogin = true;
        } else {
          this.isLogin = false;
        }
      },
    });

    if (this.isLogin) {
      this._UserService.wishlist.subscribe({
        next: (w) => {
          this.wishlistIDs = new Set(w?.items?.map((item: any) => item.product._id));
        },
      });
    }

    this._ProductService.getSubcategories().subscribe((data)=>this.subcategories=data.subcategories)

    // 1) initialize form from current query params (so refresh / shareable URL works)
    const qp = this._ActivatedRoute.snapshot.queryParams;
    const initial = {
      search: qp['search'] || '',
      min: qp['min'] || '',
      max: qp['max'] || '',
      subcategoryId: qp['subcategoryId'] || '',
      sizes: Array.isArray(qp['sizes']) ? qp['sizes'] : qp['sizes'] ? [qp['sizes']] : [],
      page: qp['page'] ? Number(qp['page']) : 1,
      limit: qp['limit'] ? Number(qp['limit']) : 20,
    };
    this.form.patchValue(initial, { emitEvent: false });

    // 2) When query params change externally (back/forward), update form and reload
    this._ActivatedRoute.queryParams.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.form.patchValue(
        {
          search: params['search'] || '',
          min: params['min'] || '',
          max: params['max'] || '',
          subcategoryId: params['subcategoryId'] || '',
          sizes: params['sizes'] || '',
          page: params['page'] ? Number(params['page']) : 1,
          limit: params['limit'] ? Number(params['limit']) : 20,
        },
        { emitEvent: false }
      );
      // this.loadProducts(); // load with updated query params
    });

    this.form.valueChanges
      .pipe(
        debounceTime(350),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        takeUntil(this.destroy$),
        switchMap((val) => {
          // sync URL
          this.updateQueryParams(val);
          // perform API call
          return of(val);
        })
      )
      .subscribe(() => this.loadProducts());

    // 4) initial load
    this.loadProducts();
  }

  private buildFiltersFromForm() {
    const v = this.form.value;
    // only include keys that the backend expects (min,max,subcategoryId,size,search,page,limit)
    return {
      search: v.search || undefined,
      min: v.min || undefined,
      max: v.max || undefined,
      subcategoryId: v.subcategoryId || undefined,
      sizes: v.sizes && v.sizes.length > 0 ? v.sizes : undefined,
      page: v.page || undefined,
      limit: v.limit || undefined,
    };
  }

  loadProducts() {
    const filters = this.buildFiltersFromForm();
    this._ProductService
      .getProducts(filters)
      .pipe(
        takeUntil(this.destroy$),
        catchError((err) => {
          console.error(err);
          return of([] as Product[]);
        })
      )
      .subscribe({
        next: (data) => {
          this.productsList = data.products;
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

  updateQueryParams(val: any) {
    // remove empty values to keep URL clean
    const cleaned: any = {};
    Object.keys(val).forEach((k) => {
      const v = val[k];
      if (Array.isArray(v)) {
        if (v.length > 0) cleaned[k] = v; // keep array
      } else if (v !== null && v !== undefined && v !== '') {
        cleaned[k] = v;
      }
    });
  }

  onSizeChange(event: Event, size: string) {
  const checkbox = event.target as HTMLInputElement;
  const sizes = this.form.value.sizes || [];

  if (checkbox.checked) {
    // add size if not exists
    this.form.patchValue({ sizes: [...sizes, size] });
  } else {
    // remove size
    this.form.patchValue({ sizes: sizes.filter((s: string) => s !== size) });
  }
}

  resetFilters() {
    this.form.patchValue(
      {
        search: '',
        min: '',
        max: '',
        subcategoryId: '',
        sizes: '',
        page: 1,
      },
      { emitEvent: false }
    ); // prevent triggers

    // Update URL query params
    this._Router.navigate([], {
      relativeTo: this._ActivatedRoute,
      queryParams: {},
    });

    // Load products without filters
    this.loadProducts();
  }

  toggleFilter() {
    this.isFilterOpen = !this.isFilterOpen;
  }

  details(ID: string) {
    this._Router.navigate(['/menu/' + ID]);
  }

  isInWishlist(productId: string): boolean {
    return this.wishlistIDs.has(productId);
  }

  wishlist(prodID: string) {
    if (this.isLogin) {
      if (this.isInWishlist(prodID)) {
        this._UserService.deleteFromWishlist(prodID);
      } else {
        this._UserService.addToWishlist(prodID);
      }
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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
