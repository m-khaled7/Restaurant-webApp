import { NgClass } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  imports: [NgClass],
  templateUrl: './star-rating.html',
  styleUrl: './star-rating.css'
})
export class StarRating {
@Input() fixedRating = 0;
  @Output() fixedRatingChange = new EventEmitter<number>();

  currentRating = 0;
  stars = [1, 2, 3, 4, 5];

  onMouseOver(rate: number) {
    if (this.fixedRating === 0) {
      this.currentRating = rate;
    }
  }

  onMouseOut() {
    if (this.fixedRating === 0) {
      this.currentRating = 0;
    }
  }

  onClick(rate: number) {
    if (this.fixedRating === rate) {
      this.fixedRating = 0;
      this.currentRating = 0;
    } else {
      this.fixedRating = rate;
      this.currentRating = rate;
    }
    this.fixedRatingChange.emit(this.fixedRating);
  }
}
