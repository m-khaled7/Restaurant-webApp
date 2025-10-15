import { Component, signal } from '@angular/core';
import { CommonModule,AsyncPipe } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { NotificationService } from './services/notification-service';
import { NotificationComponent } from './components/notification/notification';
import { Notification } from './services/notification-service';
import { Observable } from 'rxjs';
import { Footer } from './components/footer/footer';





@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Navbar,NotificationComponent,AsyncPipe,Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('guasto');
  notifications :Observable<Notification[]>;

  constructor(private notificationService: NotificationService) {
    this.notifications = this.notificationService.notifications$;
  }
}
