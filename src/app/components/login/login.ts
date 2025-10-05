import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth-service';
import { NotificationService } from '../../../services/notification-service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  constructor(
    private _AuthService: AuthService,
    private _Router: Router,
    private _NotificationService: NotificationService
  ) {}
  showPassword = false;
  isLoading: boolean = false;

  loginForm = new FormGroup({
    email: new FormControl(null, [Validators.email, Validators.required]),
    password: new FormControl(null, [
      Validators.required,
      Validators.pattern(
          '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'
        ),
    ]),
  });

  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  submit(loginForm: FormGroup) {
    this.isLoading = true;
    if (loginForm.valid) {
      this._AuthService.login(loginForm.value).subscribe({
        next: (data) => {
          if (data.success) {
            localStorage.setItem('userToken', data.token);
            this._AuthService.saveUserData();
            this.isLoading = false;
            this._Router.navigate(['/home']);
          } else {
            this.isLoading = false;
          }
        },
        error: (e) => {
          if (e.error.message === 'Please Verify Your Email') {
            this._NotificationService.show('ERROR', e.error.message, 'error');
            localStorage.setItem('verifyToken', e.error.token);
            this.isLoading = false;
            this._Router.navigate(['/verify-email']);
          }
          if (e.error.message) {
            this._NotificationService.show('ERROR', e.error.message, 'error');
          } else {
            this._NotificationService.show(e.name, e.message, 'error');
          }
          this.isLoading = false;
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
      this.isLoading = false;
    }
  }
}
