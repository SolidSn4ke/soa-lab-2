import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './header/header';
import { ToastContainer } from './components/toast-container/toast-container';

@Component({
  imports: [RouterOutlet, Header, ToastContainer],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('front');
}
