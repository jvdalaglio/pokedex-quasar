import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InstallPromptComponent } from './components/install-prompt/install-prompt.component';
import { OfflineIndicatorComponent } from './components/offline-indicator/offline-indicator.component';
import { PwaService } from './services/pwa.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    InstallPromptComponent,
    OfflineIndicatorComponent,
    CommonModule,
  ],
  template: `
    <app-offline-indicator></app-offline-indicator>

    @if (pwaService.updateAvailable()) {
    <div
      class="fixed top-16 left-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50 md:left-auto md:right-4 md:w-80"
    >
      <div class="flex items-center justify-between">
        <div>
          <h3 class="font-semibold">Atualização disponível</h3>
          <p class="text-sm opacity-90">Uma nova versão está disponível!</p>
        </div>
        <button
          (click)="updateApp()"
          class="bg-white text-blue-600 px-3 py-1 rounded text-sm font-medium hover:bg-gray-100"
        >
          Atualizar
        </button>
      </div>
    </div>
    }

    <router-outlet></router-outlet>
    <app-install-prompt></app-install-prompt>
  `,
})
export class AppComponent implements OnInit {
  constructor(public pwaService: PwaService) {}

  ngOnInit() {
    // Verificar por atualizações quando o app iniciar
    this.pwaService.checkForUpdates();
  }

  updateApp() {
    this.pwaService.updateApp();
  }
}
