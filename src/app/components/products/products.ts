import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CurrencyPipe, NgClass } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  takeUntil,
  catchError,
  switchMap,
} from 'rxjs/operators';
import { ProductService } from '../../services/product-service';
import { NotificationService } from '../../services/notification-service';
import { AuthService } from '../../services/auth-service';
import { UserService } from '../../services/user-service';
import { ProductModel, _Products, subcategory } from '../../models/product-model';
import { WishlistItem } from '../../models/wishlist-model';
import { cartItem } from '../../models/cart-model';

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
  cartIDs: Set<string> = new Set();
  productsList: ProductModel[] = [];
  subcategories: subcategory[] = [];
  isLogin: boolean = false;
  isFilterOpen: boolean = false;
  currentPage: number = 1;
  totalPages: number = 1;
  sizes: string[] = ['small', 'medium', 'large'];
  openMenuFor: string | null = null;
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
      sizes: [''],
      page: [1],
      limit: [10],
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

    //fill whishlist and Cart product's IDs
    if (this.isLogin) {
      this._UserService.wishlist.subscribe({
        next: (w) => {
          this.wishlistIDs = new Set(w?.items?.map((item: WishlistItem) => item.product._id));
        },
      });
      this._UserService.cart.subscribe({
        next: (w) => {
          this.cartIDs = new Set(w?.items?.map((item: cartItem) => item.product._id));
        },
      });
    }

    //get subcategories for fillter
    this._ProductService
      .getSubcategories()
      .subscribe((data) => (this.subcategories = data.subcategories));

    //  initialize form and current page from current query params
    const qp = this._ActivatedRoute.snapshot.queryParams;
    const initial = {
      search: qp['search'] || '',
      min: qp['min'] || '',
      max: qp['max'] || '',
      subcategoryId: qp['subcategoryId'] || '',
      sizes: Array.isArray(qp['sizes']) ? qp['sizes'] : qp['sizes'] ? [qp['sizes']] : [],
      page: qp['page'] ? Number(qp['page']) : 1,
      limit: qp['limit'] ? Number(qp['limit']) : 10,
    };
    this.form.patchValue(initial, { emitEvent: false });
    this.currentPage = qp['page'] ? Number(qp['page']) : 1;

    // When query params change externally (back/forward), update form and reload
    this._ActivatedRoute.queryParams.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.form.patchValue(
        {
          search: params['search'] || '',
          min: params['min'] || '',
          max: params['max'] || '',
          subcategoryId: params['subcategoryId'] || '',
          sizes: params['sizes'] || '',
          page: params['page'] ? Number(params['page']) : 1,
          limit: params['limit'] ? Number(params['limit']) : 10,
        },
        { emitEvent: false }
      );
      this.currentPage = +params['page'] || 1;
      this.loadProducts();
    });

    this.form.valueChanges
      .pipe(
        debounceTime(350),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        takeUntil(this.destroy$),
        switchMap((val) => {
          this.updateQueryParams(val);
          return of(val);
        })
      )
      .subscribe(() => {
        this.loadProducts();
      });

    // load products
    this.loadProducts();
  }

  //buils fillter for backend request from form
  private buildFiltersFromForm() {
    const v = this.form.value;

    return {
      search: v.search || undefined,
      min: v.min || undefined,
      max: v.max || undefined,
      subcategoryId: v.subcategoryId || undefined,
      sizes: v.sizes || undefined,
      page: v.page || undefined,
      limit: v.limit || undefined,
    };
  }

  loadProducts() {
    const filters = this.buildFiltersFromForm();
    this._ProductService
      .getProducts(filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.productsList = data.products;
          this.totalPages = data.totalPages;
        },
        error: (e) => {
          this._NotificationService.show('Something wrong', e.name, 'error');
          console.log(e);
        },
      });
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
    );

    // reset URL query params
    this._Router.navigate([], {
      relativeTo: this._ActivatedRoute,
      queryParams: {},
    });

    // Load products without filters
    this.loadProducts();
  }

  updateQueryParams(val: any) {
    const cleaned: any = {};
    Object.keys(val).forEach((k) => {
      const v = val[k];
      if (v !== null && v !== undefined && v !== '') {
        cleaned[k] = v;
      }
    });

    this._Router.navigate([], {
      relativeTo: this._ActivatedRoute,
      queryParams: cleaned,
      queryParamsHandling: 'merge',
    });
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;

    this.currentPage = page;

    // Update query params so URL stays in sync
    this._Router.navigate([], {
      relativeTo: this._ActivatedRoute,
      queryParams: { page: this.currentPage },
      queryParamsHandling: 'merge',
    });

    // Reload products
    this.loadProducts();
  }

  get pagesArray(): number[] {
    return Array(this.totalPages)
      .fill(0)
      .map((x, i) => i + 1);
  }

  toggleMenu(id: string) {
    this.openMenuFor = this.openMenuFor === id ? null : id;
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

  isInCart(productId: string): boolean {
    return this.cartIDs.has(productId);
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

  addToCart(prodID:string,size:string){
    this._UserService.addToCart(prodID,size)
    this.toggleMenu(prodID)

  }

  cart(prodID: string) {
    if (this.isLogin) {
      if (this.isInCart(prodID)) {
        this._UserService.deleteFromCart(prodID);
      } else {
        this.toggleMenu(prodID)
      }
    } else {
      this._NotificationService.show('ERROR', 'please Login frist', 'error');
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
