import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Chef {
  id: number;
  name: string;
  role: string;
  image: string;
  description: string;
  specialties: string[];
  experience: string;
  socialLinks: {
    facebook: string;
    twitter: string;
    instagram: string;
  };
}

@Component({
  selector: 'app-chefs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chefs.html',
  styleUrl: './chefs.css',
})
export class Chefs {
  currentSlide = 0;
  isMobile = window.innerWidth < 768;

  constructor() {
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth < 768;
    });
  }

  chefs: Chef[] = [
    {
      id: 1,
      name: 'Marco Rossi',
      role: 'Executive Chef',
      image: 'assets/chef1.jpg',
      description:
        'With over 15 years of culinary excellence, Chef Marco brings authentic Italian flavors to every dish.',
      specialties: ['Italian Cuisine', 'Mediterranean Dishes', 'Fine Dining'],
      experience: '15+ years',
      socialLinks: {
        facebook: 'https://facebook.com/marcorossi',
        twitter: 'https://twitter.com/marcorossi',
        instagram: 'https://instagram.com/marcorossi',
      },
    },
    {
      id: 2,
      name: 'Sofia Bianchi',
      role: 'Pastry Chef',
      image: 'assets/chef2.jpg',
      description:
        'A master of sweet creations, Chef Sofia crafts exquisite desserts that are both beautiful and delicious.',
      specialties: ['French Pastries', 'Italian Desserts', 'Chocolate Work'],
      experience: '10+ years',
      socialLinks: {
        facebook: 'https://facebook.com/sofiabianchi',
        twitter: 'https://twitter.com/sofiabianchi',
        instagram: 'https://instagram.com/sofiabianchi',
      },
    },
    {
      id: 3,
      name: 'Luca Conti',
      role: 'Head Chef',
      image: 'assets/chef3.jpg',
      description:
        'Chef Luca specializes in creating innovative fusion dishes that combine traditional and modern techniques.',
      specialties: ['Fusion Cuisine', 'Modern Italian', 'Seafood'],
      experience: '12+ years',
      socialLinks: {
        facebook: 'https://facebook.com/lucaconti',
        twitter: 'https://twitter.com/lucaconti',
        instagram: 'https://instagram.com/lucaconti',
      },
    },
    {
      id: 4,
      name: 'Isabella Romano',
      role: 'Sous Chef',
      image: 'assets/chef4.jpg',
      description:
        'Known for her innovative approach to traditional recipes, Chef Isabella brings creativity to every plate.',
      specialties: ['Contemporary Italian', 'Vegetarian Cuisine', 'Farm-to-Table'],
      experience: '8+ years',
      socialLinks: {
        facebook: 'https://facebook.com/isabellaromano',
        twitter: 'https://twitter.com/isabellaromano',
        instagram: 'https://instagram.com/isabellaromano',
      },
    },
  ];

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.chefs.length;
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.chefs.length) % this.chefs.length;
  }
}
