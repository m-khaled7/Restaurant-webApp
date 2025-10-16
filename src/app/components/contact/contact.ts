import { Component, OnInit } from '@angular/core';
import {FormGroup,ReactiveFormsModule, Validators,FormBuilder } from '@angular/forms';
import { NotificationService } from '../../services/notification-service';
import { UserService } from '../../services/user-service';



@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class Contact implements OnInit {
  isLoading:boolean=false
  form!:FormGroup
  constructor(private _UserService:UserService,private _NotificationService:NotificationService,private fb: FormBuilder){

  }
ngOnInit(): void {
  this.form = this.fb.group({
    message: ['',[Validators.required] ]
  });
}
 

   get message() {
    return this.form.get('message');
  }

  clear(){
    this.form.patchValue({message:""})
  }

  submit(formdata:any){
    this.isLoading = true;
    if (this.form.valid) {
      this._UserService.contactus(formdata.value).subscribe({
        next: (data) => {
          if (data.success) {
            this._NotificationService.show('SUCCESS', data.message, 'success');
            this.isLoading = false;

          } 
        },
        error: (e) => {
          if (e.error.message) {
            this._NotificationService.show('ERROR', e.error.message, 'error');
          } else {
            this._NotificationService.show(e.name, e.message, 'error');
          }
          this.isLoading = false;
        },
      });
    } else {
      this.form.markAllAsTouched();
      this.isLoading = false;
    }
  }

  }


