import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Contact } from './components/contact/contact';
import { About } from './components/about/about';
import { Login } from './components/login/login';
import { Signup } from './components/signup/signup';
import { authGuard } from './auth-guard';
import { VerifyCode } from './components/verify-code/verify-code';
import { Wishlist } from './components/wishlist/wishlist';
import { Cart } from './components/cart/cart';
import { Products } from './components/products/products';

export const routes: Routes = [
    {path:"",redirectTo:"home",pathMatch:"full"},
    {path:"home",component:Home,title:"Guasto Restaurant"},
    {path:"contacts",canActivate:[authGuard],component:Contact,title:"Contact US"},
    {path:"about",component:About,title:"About Us"},
    {path:"login",component:Login,title:"Login"},
    {path:"signup",component:Signup,title:"Sign Up"},
    {path:"verify-email",component:VerifyCode,title:"verify Email"},
    {path:"wishlist",component:Wishlist,title:"wishlist"},
    {path:"cart",component:Cart,title:"My Cart"},
    {path:"menu",component:Products,title:"Menu"}
    
    
];
