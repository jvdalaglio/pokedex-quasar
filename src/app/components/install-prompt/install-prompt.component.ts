import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-install-prompt',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (showInstallPrompt()) {
    <div
      class="fixed bottom-4 left-4 right-4 bg-red-600 text-white p-4 rounded-lg shadow-lg z-50 md:left-auto md:right-4 md:w-80"
    >
      <div class="flex items-center justify-between">
        <div>
          <h3 class="font-semibold">Instalar Pokédex</h3>
          <p class="text-sm opacity-90">
            Adicione ao seu dispositivo para acesso rápido!
          </p>
        </div>
        <div class="flex gap-2 ml-4">
          <button
            (click)="installApp()"
            class="bg-white text-red-600 px-3 py-1 rounded text-sm font-medium hover:bg-gray-100"
          >
            Instalar
          </button>
          <button
            (click)="dismissPrompt()"
            class="text-white/80 hover:text-white"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
    }
  `,
})
export class InstallPromptComponent implements OnInit {
  showInstallPrompt = signal(false);
  private deferredPrompt: any;

  ngOnInit() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallPrompt.set(true);
    });

    window.addEventListener('appinstalled', () => {
      this.showInstallPrompt.set(false);
      this.deferredPrompt = null;
    });
  }

  async installApp() {
    if (!this.deferredPrompt) return;

    const result = await this.deferredPrompt.prompt();

    if (result.outcome === 'accepted') {
      this.showInstallPrompt.set(false);
    }

    this.deferredPrompt = null;
  }

  dismissPrompt() {
    this.showInstallPrompt.set(false);
    this.deferredPrompt = null;
  }
}
