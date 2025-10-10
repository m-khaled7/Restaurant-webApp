import { Component } from '@angular/core';
<<<<<<< HEAD
import { RouterLink } from '@angular/router';
=======
import { Router } from '@angular/router';
>>>>>>> 07aa549 (adding chef,testimonials,mobilenavbar and footer)
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { NotificationService } from '../../services/notification-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forget-password',
<<<<<<< HEAD
  imports: [ ReactiveFormsModule],
=======
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
>>>>>>> 07aa549 (adding chef,testimonials,mobilenavbar and footer)
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
          if (data.success) {
            this.isLoading = false;
            this._NotificationService.show('success', data.message, 'success');
          } else {
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
      this.forgetPasswordForm.markAllAsTouched();
      this.isLoading = false;
    }
  }
}
