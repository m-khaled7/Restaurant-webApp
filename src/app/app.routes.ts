import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Contact } from './components/contact/contact';
import { About } from './components/about/about';
import { Login } from './components/login/login';
import { Signup } from './components/signup/signup';
import { authGuard } from './guards/auth-guard';
import { VerifyCode } from './components/verify-code/verify-code';
import { Wishlist } from './components/wishlist/wishlist';
import { Cart } from './components/cart/cart';
import { Products } from './components/products/products';
import { ForgetPassword } from './components/forget-password/forget-password';
import { ResetPassword } from './components/reset-password/reset-password';
import { ProductDetails } from './components/product-details/product-details';
import { Profile } from './components/profile/profile';

export const routes: Routes = [
    {path:"",redirectTo:"home",pathMatch:"full"},
    {path:"home",component:Home,title:"Guasto Restaurant"},
    {path:"contacts",canActivate:[authGuard],component:Contact,title:"Contact US"},
    {path:"about",component:About,title:"About Us"},
    {path:"login",component:Login,title:"Login"},
    {path:"signup",component:Signup,title:"Sign Up"},
    {path:"verify-email",component:VerifyCode,title:"verify Email"},
    {path:"wishlist",canActivate:[authGuard],component:Wishlist,title:"wishlist"},
    {path:"cart",canActivate:[authGuard],component:Cart,title:"My Cart"},
    {path:"menu",component:Products,title:"Menu"},
    {path:"menu/:id",component:ProductDetails,title:"product"},
    {path:"forget-password",component:ForgetPassword,title:"forget password"},
    {path:"reset-password",component:ResetPassword,title:"Reset Password"},
    {path:"profile",component:Profile,title:"profile"}
    
    
];
