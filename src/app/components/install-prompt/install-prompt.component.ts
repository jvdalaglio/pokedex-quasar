import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-install-prompt',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './install-prompt.component.html',
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
