import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { NotificationService } from '../../services/notification-service';

@Component({
  selector: 'app-forget-password',
  imports: [ReactiveFormsModule],
  templateUrl: './forget-password.html',
  styleUrl: './forget-password.css',
})
export class ForgetPassword {
  constructor(
    private _AuthService: AuthService,
    private _NotificationService: NotificationService
  ) {}
  isLoading: boolean = false;

  forgetPasswordForm = new FormGroup({
    email: new FormControl(null, [Validators.email, Validators.required]),
  });
  get email() {
    return this.forgetPasswordForm.get('email');
  }
  submit(forgetPasswordForm: FormGroup) {
    this.isLoading = true;
    if (forgetPasswordForm.valid) {
      this._AuthService.forgetPassword(forgetPasswordForm.value).subscribe({
        next: (data) => {
          this.isLoading = false;
          this._NotificationService.show('success', data.message, 'success');
        },
        error: (e) => {
          if (e.error.message) {
            this._NotificationService.show('ERROR', e.error.message, 'error');
          } else {
            this._NotificationService.show('something wrong', e.name, 'error');
            console.log(e);
          }
          this.isLoading = false;
        },
      });
    } else {
      this.forgetPasswordForm.markAllAsTouched();
      this.isLoading = false;
    }
  }
}
