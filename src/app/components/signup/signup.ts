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
import { Router, RouterLink } from '@angular/router';
import { NotificationService } from '../../services/notification-service';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  constructor(
    private _AuthService: AuthService,
    private _Router: Router,
    private _NotificationService: NotificationService
  ) {}

  isLoading: boolean = false;
  showPassword = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  registerForm: FormGroup = new FormGroup(
    {
      name: new FormControl(null, [
        Validators.minLength(3),
        Validators.maxLength(20),
        Validators.required,
      ]),
      email: new FormControl(null, [Validators.email, Validators.required]),
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

  get name() {
    return this.registerForm.get('name');
  }
  get email() {
    return this.registerForm.get('email');
  }
  get password() {
    return this.registerForm.get('password');
  }

  passwordsMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const group = control as FormGroup;
      const password = group.get('password')?.value;
      const confirm = group.get('password_confirmation')?.value;
      return password === confirm ? null : { passwordsMismatch: true };
    };
  }

  submit(registerForm: FormGroup) {
    this.isLoading = true;
    if (registerForm.valid) {
      this._AuthService.signup(registerForm.value).subscribe({
        next: (data) => {
            localStorage.setItem('verifyToken', data.token);
            this.isLoading = false;
            this._NotificationService.show('Verify', data.message, 'info');
            this._Router.navigate(['/verify-email']);
        },
        error: (e) => {
          console.log(e);
           if (e.error.message) {
            this._NotificationService.show('ERROR', e.error.message, 'error');
          }
            this._NotificationService.show("something wrong", e.name, 'error');
          console.log(e)
          this.isLoading = false;
        },
      });
    } else {
      this.registerForm.markAllAsTouched();
      this.isLoading = false;
    }
  }
}
