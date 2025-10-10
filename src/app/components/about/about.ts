import { Component } from '@angular/core';
<<<<<<< HEAD


@Component({
  selector: 'app-about',
  imports: [],
=======
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
>>>>>>> 07aa549 (adding chef,testimonials,mobilenavbar and footer)
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {}
