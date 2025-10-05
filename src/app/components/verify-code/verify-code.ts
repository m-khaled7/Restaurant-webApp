import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth-service';
import { NotificationService } from '../../../services/notification-service';

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
          if (data.success) {
            this.isLoading = false;
            localStorage.removeItem('verifyToken');
            localStorage.setItem('userToken', data.token);
            this._AuthService.saveUserData();
            this._NotificationService.show('verified', data.message, 'success');
            this._Router.navigate(['/home']);
          } else {
            this.isLoading = false;
            this._NotificationService.show('ERROR', 'some thing gose wrong', 'error');
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
      this.codeForm.markAllAsTouched();
      this.isLoading = false;
    }
  }

  resendCode() {
    this._AuthService.resendCode().subscribe({
      next: (data) => {
        if (data.success) {
          this.isLoading = false;
          this._NotificationService.show('Success', data.message, 'success');
        } else {
          this.isLoading = false;
          this._NotificationService.show('ERROR', 'some thing gose wrong', 'error');
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
  }
}
