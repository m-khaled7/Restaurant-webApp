import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth-service';

interface NavItem {
  label: string;
  path: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class Navbar implements OnInit {
  constructor(private _AuthService: AuthService) {}

  isLogin = false;
  isMobileMenuOpen = false;

  navItems: NavItem[] = [
    { label: 'Home', path: '/home' },
    { label: 'Menu', path: '/menu' },
    { label: 'Our Chefs', path: '/chefs' },
    { label: 'Reviews', path: '/testimonials' },
    { label: 'Contact', path: '/contact' },
    { label: 'About', path: '/about' },
  ];

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  ngOnInit(): void {
    this._AuthService.userData.subscribe({
      next: () => {
        this.isLogin = this._AuthService.userData.getValue() != null;
      },
    });
  }

  logout() {
    this._AuthService.logout();
  }
}
