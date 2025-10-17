import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { NotificationService } from '../../services/notification-service';

@Component({
  selector: 'app-verify-code',
  imports: [ReactiveFormsModule],
  templateUrl: './verify-code.html',
  styleUrl: './verify-code.css',
})
export class VerifyCode {
  constructor(
    private _AuthService: AuthService,
    private _Router: Router,
    private _NotificationService: NotificationService
  ) {}

  isLoading: boolean = false;
  isLoadingResend: boolean = false;

  codeForm = new FormGroup({
    code: new FormControl(null, [
      Validators.minLength(4),
      Validators.maxLength(4),
      Validators.required,
    ]),
  });

  get code() {
    return this.codeForm.get('code');
  }

  submit(codeForm: FormGroup) {
    this.isLoading = true;

    if (codeForm.valid) {
      this._AuthService.verifyCode(codeForm.value).subscribe({
        next: (data) => {
          this.isLoading = false;
          localStorage.removeItem('verifyToken');
          localStorage.setItem('userToken', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          this._AuthService.saveUserData();
          this._NotificationService.show(
            'verified',
            'your account has been verified successfully',
            'success'
          );
          this._Router.navigate(['/home']);
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
      this.codeForm.markAllAsTouched();
      this.isLoading = false;
    }
  }

  resendCode(event: Event) {
    event.preventDefault();
    this.isLoadingResend = true;

    this._AuthService.resendCode().subscribe({
      next: (data) => {
        this.isLoadingResend = false;
        this._NotificationService.show('Success', data.message, 'success');
      },
      error: (e) => {
        if (e.error.message) {
          this._NotificationService.show('ERROR', e.error.message, 'error');
        }
        this._NotificationService.show('something wrong', e.name, 'error');

        console.log(e);
        this.isLoadingResend = false;
      },
    });
  }
}
