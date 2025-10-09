import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { AuthService } from '../../services/auth-service';

import { Router ,ActivatedRoute } from '@angular/router';
import { NotificationService } from '../../services/notification-service';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css'
})
export class ResetPassword {
 constructor(
    private _AuthService: AuthService,
    private _Router: Router,
    private _NotificationService: NotificationService,
    private _ActivatedRoute:ActivatedRoute
  ) {}
   isLoading: boolean = false;
  showPassword = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

    resetPasswordForm: FormGroup = new FormGroup(
    {
      
      password: new FormControl(null, [
        Validators.required,
        Validators.pattern(
          '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'
        ),
      ]),
      password_confirmation: new FormControl(null, [
        Validators.required,
        Validators.pattern(
          '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'
        ),
      ]),
    },
    {
      validators: [this.passwordsMatchValidator()],
    }
  );
  get password() {
    return this.resetPasswordForm.get('password');
  }

  passwordsMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const group = control as FormGroup;
      const password = group.get('password')?.value;
      const confirm = group.get('password_confirmation')?.value;

      return password === confirm ? null : { passwordsMismatch: true };
    };
  }



  submit(resetPasswordForm: FormGroup) {
    this.isLoading = true;
    let token
    this._ActivatedRoute.queryParams.subscribe(params => {
    token=params['token'];
  });
    if (resetPasswordForm.valid) {
      this._AuthService.resetPassword({token,...resetPasswordForm.value}).subscribe({
        next: (data) => {
          if (data.success) {
          this.isLoading = false;
          this._NotificationService.show("SUCCESS", data.message, 'success');
          this._Router.navigate(['/login']);
          } else {
            this.isLoading = false;
          }
        },
        error: (e) => {
          console.log(e)
          if(e.error.message){
          this._NotificationService.show("ERROR", e.error.message, 'error');

          }else{
          this._NotificationService.show(e.name, e.message, 'error');

          }
          this.isLoading = false;
        },
      });
    } else {
      this.resetPasswordForm.markAllAsTouched();
      this.isLoading = false;
    }
  }

}
