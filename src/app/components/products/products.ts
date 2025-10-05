import { Component } from '@angular/core';

@Component({
  selector: 'app-products',
  imports: [],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products {
  details(){
    alert("details")
  }
  cart(){
    alert("cart")
  }
}
