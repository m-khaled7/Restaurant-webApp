import { DatePipe } from '@angular/common';
import { Component, Input, Output, EventEmitter, input } from '@angular/core';
import { StarRating } from './star-rating/star-rating';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../services/notification-service';

@Component({
  selector: 'app-review',
  imports: [StarRating, FormsModule],
  templateUrl: './review.html',
  styleUrl: './review.css',
})
export class Review {
  constructor(private _NotificationService: NotificationService) {}
  rating = 0;
  commentText = '';
 

  @Output() addComment = new EventEmitter<{ rating: number; comment: string }>();
  @Input() user:any ={}

  


  submit() {
    if (this.rating === 0) {
      this._NotificationService.show('waring', 'you must add rate', 'warning');
      return;
    }

    if (!this.commentText.trim()) {
      this._NotificationService.show('waring', 'Comment cannot be empty.', 'warning');

      return;
    }

    this.addComment.emit({
      rating: this.rating,
      comment: this.commentText,
    });

    this.rating = 0;
    this.commentText = '';
  }
}
