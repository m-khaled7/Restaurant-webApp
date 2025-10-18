import { CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user-service';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-orders',
  imports: [NgClass, DatePipe, CurrencyPipe, FormsModule,RouterLink],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders implements OnInit {
  constructor(private _UserService: UserService) {}
  orders: any[] = []; // replace any with your Order model

  ngOnInit() {
    this._UserService.getOrders().subscribe({
      next: (data) => {
        this.orders = data;
      },
    });
  }

  details(Id:string){

  }
}
