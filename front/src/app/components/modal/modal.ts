import { Component, EventEmitter, HostListener, Output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-modal',
  styleUrl: './modal.scss',
  templateUrl: './modal.html',
})
export class Modal {

  @Output() public closed = new EventEmitter<void>();

  public onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closed.emit();
    }
  }

  @HostListener('document:keydown.escape')
  public onEscape(): void {
    this.closed.emit();
  }
}
