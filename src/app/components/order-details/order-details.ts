import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user-service';
import { DatePipe,DecimalPipe } from '@angular/common';
import { NotFound } from '../not-found/not-found';
import {Order} from "../../models/order"

@Component({
  selector: 'app-order-details',
  imports: [DatePipe,DecimalPipe,NotFound],
  templateUrl: './order-details.html',
  styleUrl: './order-details.css'
}) 
export class OrderDetails implements OnInit{
constructor(private _ActivatedRoute:ActivatedRoute ,private _UserService:UserService){}
order:Order|null =null
ngOnInit(): void {

  this._ActivatedRoute.paramMap.subscribe((params) => {
      const id = params.get('id');
       this._UserService.getOrdersById(String(id)).subscribe({
          next:(data)=>{this.order=data},
          error:(e)=>{console.log(e);
          }
        })
    });

}
}
