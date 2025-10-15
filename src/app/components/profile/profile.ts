import { NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup ,FormBuilder,Validators,ReactiveFormsModule} from '@angular/forms';
import { UserService } from '../../services/user-service';
import { AuthService } from '../../services/auth-service';






@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule,NgClass],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
form!: FormGroup;
selectedFile!: File;
user:any={}

constructor(private fb: FormBuilder, private _HttpClient: HttpClient,private _UserService:UserService,private _AuthService:AuthService) {}

ngOnInit() { 
  this.user=JSON.parse(String(localStorage.getItem('user')))
  this.form = this.fb.group({
    name: ['' ]
  });
  this.form.patchValue({ name: this.user.name })
}

// Handle file change
onFileSelected(event: any) {
  this.selectedFile = event.target.files[0];
  console.log("Selected file:", this.selectedFile);
}


onSubmit() {
  const formData = new FormData();

  // Always append something
  formData.append("name", this.form.get("name")?.value || "");

  if (this.selectedFile) {
    formData.append("image", this.selectedFile);  // MUST be "image" (matches upload.single('image'))
  }

  // ✅ Debug properly
  for (let pair of formData.entries()) {
    console.log(pair[0], pair[1]);
  }

  this._UserService.updateProfile(formData).subscribe({
    next:(data)=>{
      console.log(data)

    },
    error:(e)=>{console.log(e)}
  })
}

signout(){
  this._AuthService.logout()
}

}
