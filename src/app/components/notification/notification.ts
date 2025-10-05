import { Component, Input, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

// Define the shape of the notification type for styling
type NotificationType = 'error' | 'success' | 'warning' | 'info';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isVisible) {
      <div 
        [ngClass]="getNotificationClasses()"
        role="alert"
      >
        <!-- Icon -->
        <div class="flex-shrink-0">
          <!-- Using inline SVG for icons -->
          @switch (type) {
            @case ('error') {
              <svg class="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            @case ('success') {
              <svg class="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2l4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            @case ('warning') {
              <svg class="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.3 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            }
            @default {
              <svg class="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          }
        </div>
        
        <!-- Content -->
        <div class="ml-3 flex-1 pt-0.5">
          <p [ngClass]="getTitleClasses()">{{ title }}</p>
          <p [ngClass]="getMessageClasses()">{{ message }}</p>
        </div>
        
        <!-- Close Button -->
        <div class="ml-4 flex-shrink-0 flex">
          <button 
            (click)="closeNotification()"
            class="inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2"
            [ngClass]="getButtonClasses()"
          >
            <span class="sr-only">Dismiss</span>
            <!-- Close icon (X) -->
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    }
  `,
  styles: [`
    /* Host element to position the notification fixed at the bottom right */
    :host {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 1000;
      pointer-events: none; /* Allow clicks through when not visible */
    }
    
    /* Transition for smooth visibility changes */
    .notification-enter {
      opacity: 0;
      transform: translateY(20px);
    }
    .notification-enter-active {
      opacity: 1;
      transform: translateY(0);
      transition: opacity 0.3s ease-out, transform 0.3s ease-out;
    }
    .notification-leave-active {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.3s ease-in, transform 0.3s ease-in;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationComponent implements OnInit, OnDestroy {
  // REQUIRED INPUTS
  @Input({ required: true }) title!: string;
  @Input({ required: true }) message!: string;
  
  // OPTIONAL INPUTS
  @Input() type: NotificationType = 'error'; // Default to 'error'
  @Input() durationMs: number = 5000; // Default to 3 seconds

  isVisible: boolean = true;
  private timer: any;

  ngOnInit(): void {
    // Set a timer to automatically close the notification
    this.timer = setTimeout(() => {
      this.closeNotification();
    }, this.durationMs);
  }

  ngOnDestroy(): void {
    // Clear the timeout to prevent memory leaks if the component is destroyed manually
    clearTimeout(this.timer);
  }

  closeNotification(): void {
    this.isVisible = false;
    // Optional: You might want to use a state management service to remove 
    // the component from the DOM after the transition is complete.
  }

  // --- Dynamic Class Generation for Tailwind Styling ---

  getNotificationClasses(): string {
    let classes = 'p-4 rounded-lg shadow-xl flex max-w-sm w-full pointer-events-auto notification-enter-active';
    
    switch (this.type) {
      case 'success':
        classes += ' bg-green-50 border border-green-200';
        break;
      case 'warning':
        classes += ' bg-yellow-50 border border-yellow-200';
        break;
      case 'info':
        classes += ' bg-blue-50 border border-blue-200';
        break;
      case 'error':
      default:
        classes += ' bg-red-50 border border-red-200';
        break;
    }
    return classes;
  }

  getTitleClasses(): string {
    let classes = 'font-bold';
    switch (this.type) {
      case 'success':
        classes += ' text-green-800';
        break;
      case 'warning':
        classes += ' text-yellow-800';
        break;
      case 'info':
        classes += ' text-blue-800';
        break;
      case 'error':
      default:
        classes += ' text-red-800';
        break;
    }
    return classes;
  }
  
  getMessageClasses(): string {
    let classes = 'text-sm mt-1';
    switch (this.type) {
      case 'success':
        classes += ' text-green-700';
        break;
      case 'warning':
        classes += ' text-yellow-700';
        break;
      case 'info':
        classes += ' text-blue-700';
        break;
      case 'error':
      default:
        classes += ' text-red-700';
        break;
    }
    return classes;
  }

  getButtonClasses(): string {
    let classes = 'hover:bg-opacity-50';
    switch (this.type) {
      case 'success':
        classes += ' text-green-700 hover:bg-green-100 focus:ring-green-600';
        break;
      case 'warning':
        classes += ' text-yellow-700 hover:bg-yellow-100 focus:ring-yellow-600';
        break;
      case 'info':
        classes += ' text-blue-700 hover:bg-blue-100 focus:ring-blue-600';
        break;
      case 'error':
      default:
        classes += ' text-red-700 hover:bg-red-100 focus:ring-red-600';
        break;
    }
    return classes;
  }
}
