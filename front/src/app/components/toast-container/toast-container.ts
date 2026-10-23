import { Component, inject } from '@angular/core';
import { NotificationService } from '../../services/notification.service';

@Component({
  imports: [],
  selector: 'app-toast-container',
  styleUrl: './toast-container.scss',
  templateUrl: './toast-container.html',
})
export class ToastContainer {
  readonly notifications = inject(NotificationService);
}
