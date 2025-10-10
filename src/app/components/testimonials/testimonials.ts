import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Testimonial {
  id: number;
  name: string;
  image: string;
  rating: number;
  comment: string;
}

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonials.html',
  styleUrl: './testimonials.css',
})
export class Testimonials {
  currentSlide = 0;
  isMobile = window.innerWidth < 768;

  constructor() {
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth < 768;
    });
  }

  testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Sarah Johnson',
      image: 'assets/customer1.jpg',
      rating: 5,
      comment:
        'The culinary excellence at this restaurant is unmatched! Every dish is a masterpiece of flavors and presentation. The service is impeccable, and the atmosphere is perfect for both special occasions and casual dining.',
    },
    {
      id: 2,
      name: 'Michael Brown',
      image: 'assets/customer2.jpg',
      rating: 4.5,
      comment:
        'As someone who lived in Italy for years, I can say the authentic flavors here transported me back. Their attention to traditional recipes while adding modern twists is impressive. The wine selection is exceptional!',
    },
    {
      id: 3,
      name: 'Emily Davis',
      image: 'assets/customer3.jpg',
      rating: 5,
      comment:
        'From appetizers to desserts, every course was spectacular. The chefs clearly pour their hearts into each dish. The seasonal menu keeps me coming back to try new creations!',
    },
    {
      id: 4,
      name: 'David Wilson',
      image: 'assets/customer4.jpg',
      rating: 5,
      comment:
        'The tasting menu was an incredible culinary journey! The way they pair traditional Italian flavors with local ingredients shows real creativity. The staffs knowledge of each dish adds to the experience.',
    },
    {
      id: 5,
      name: 'Lisa Martinez',
      image: 'assets/customer5.jpg',
      rating: 4.5,
      comment:
        'Their pasta dishes are simply divine! Everything is made fresh in-house, and you can taste the difference. The ambiance and service make every visit feel special.',
    },
  ];

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.testimonials.length;
  }

  prevSlide() {
    this.currentSlide =
      (this.currentSlide - 1 + this.testimonials.length) % this.testimonials.length;
  }

  getStars(rating: number): number[] {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = Array(5).fill(0);

    return stars.map((_, index) => {
      if (index < fullStars) return 1;
      if (index === fullStars && hasHalfStar) return 0.5;
      return 0;
    });
  }
}
