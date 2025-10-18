import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { UserService } from '../../services/user-service';
import { FormsModule } from '@angular/forms';




@Component({
  selector: 'app-profile',
  imports: [FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  user: any = {};
  isLoading: boolean = false;


  constructor(private _AuthService: AuthService,private _UserService:UserService) {}

  ngOnInit() {
    const userdata=localStorage.getItem('user')
    if(userdata){
      this.user=JSON.parse(userdata)
    }
  }

  name: string = '';
  imageFile?: File;
  message: string = '';


  onFileSelected(event: any) {
    this.imageFile = event.target.files[0];
  }

  updateProfile() {
    this.isLoading=true
    this._UserService.updateProfile(this.name, this.imageFile).subscribe({
      next: (res) => {
        this.message = res.message;
        localStorage.setItem("user",JSON.stringify(res.user))
        this.user=res.user
        this.isLoading=false
      },
      error: (err) => {
        this.message = err.error?.message || 'Something went wrong';
        this.isLoading=false

      },
    });
  }

  signout() {
    this._AuthService.logout();
  }
}
