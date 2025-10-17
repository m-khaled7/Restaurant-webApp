import { Component, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user-service';
import { NotificationService } from '../../services/notification-service';


@Component({
  selector: 'app-success-order',
  imports: [RouterLink],
  templateUrl: './success-order.html',
  styleUrl: './success-order.css',
})
export class SuccessOrder implements OnInit {
  isLoading: boolean = true;
  currentOrderId: string = '';
  constructor(private _ActivatedRoute: ActivatedRoute, private _UserService: UserService,private _NotificationService:NotificationService) {}
  ngOnInit(): void {
    const orderId = this._ActivatedRoute.snapshot.queryParams['orderId'];

    if (orderId) {
      this._UserService.paidOrder(orderId).subscribe({
        next: (data) => {
          this.currentOrderId = data.order._id;
          this.isLoading = false;
        },
        error: (e) => {
          if (e.error.message) {
            this._NotificationService.show('ERROR', e.error.message, 'error');
          } else {
            this._NotificationService.show('something wrong', e.name, 'error');
            console.log(e);
          }
        },
      });
    }
  }
}
