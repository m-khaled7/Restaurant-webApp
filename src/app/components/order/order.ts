import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user-service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-order',
  imports: [ReactiveFormsModule],
  templateUrl: './order.html',
  styleUrl: './order.css'
})
export class Order implements OnInit {
  shippingMethods:any=[]

  constructor(private _UserService: UserService,private _Router:Router){
  }
  ngOnInit(): void {
     this._UserService.getShippingMethods().subscribe({
      next:(data)=>{this.shippingMethods=data},
      error:(e)=>{console.log(e)}
    })
  }

  orderForm = new FormGroup({
    shippingMethodId: new FormControl(null, [Validators.required]),
    paymentMethod: new FormControl(null, [Validators.required]),
  });


  get paymentMethod() {
    return this.orderForm.get('paymentMethod');
  }

  get shippingMethodId() {
    return this.orderForm.get('shippingMethodId');
  }

 shippingForm = new FormGroup({
    fullName: new FormControl(null, [Validators.required]),
    addressLine1: new FormControl(null, [Validators.required]),
    addressLine2: new FormControl(null),
    city: new FormControl(null, [Validators.required]),
    state: new FormControl(null),
    postalCode: new FormControl(null, [Validators.required]),
    country: new FormControl(null, [Validators.required]),
    phone: new FormControl(null, [Validators.required]),
  });



 checkout(){
      console.log({...this.orderForm.value,shippingAddress:{...this.shippingForm.value}})

    if(this.orderForm.valid&&this.shippingForm.valid){
      console.log({...this.orderForm.value,shippingAddress:{...this.shippingForm.value}})
      this._UserService.createOrder({...this.orderForm.value,shippingAddress:{...this.shippingForm.value}}).subscribe({
        next:(data)=>{
          console.log(data)
          window.open(data.url, '_blank');
        },
        error:(e)=>{console.log(e)}
      })
    }else{
           console.log({...this.orderForm.value,shippingAddress:{...this.shippingForm.value}})
           this.orderForm.markAllAsTouched();
           this.shippingForm.markAllAsTouched();

      
    }
  }


}
