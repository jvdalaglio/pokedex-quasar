import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-offline-indicator',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (!isOnline()) {
    <div
      class="fixed top-0 left-0 right-0 bg-yellow-500 text-black p-2 text-center text-sm font-medium z-50"
    >
      <span class="flex items-center justify-center gap-2">
        <span class="w-2 h-2 bg-black rounded-full animate-pulse"></span>
        Você está offline - Alguns dados podem estar desatualizados
      </span>
    </div>
    }
  `,
})
export class OfflineIndicatorComponent implements OnInit {
  isOnline = signal(navigator.onLine);

  ngOnInit() {
    window.addEventListener('online', () => this.isOnline.set(true));
    window.addEventListener('offline', () => this.isOnline.set(false));
  }
}
