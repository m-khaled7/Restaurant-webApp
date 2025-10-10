import { Component } from '@angular/core';
import { About } from '../about/about';
import { Footer } from '../footer/footer';
import { Chefs } from '../chefs/chefs';
import { Testimonials } from '../testimonials/testimonials';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [About, Footer, Chefs, Testimonials],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
