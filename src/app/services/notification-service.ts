// src/app/services/notification.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type NotificationType = 'error' | 'success' | 'warning' | 'info';

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: NotificationType;
  durationMs?: number;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private notifications: Notification[] = [];
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  private idCounter = 0;

  show(title: string, message: string, type: NotificationType = 'info', durationMs = 5000): void {
    const id = ++this.idCounter;
    const notification: Notification = { id, title, message, type, durationMs };

    this.notifications.push(notification);
    this.notificationsSubject.next(this.notifications);

    // Auto-remove after duration
    setTimeout(() => this.remove(id), durationMs);
  }

  remove(id: number): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notificationsSubject.next(this.notifications);
  }

  clear(): void {
    this.notifications = [];
    this.notificationsSubject.next(this.notifications);
  }
}
