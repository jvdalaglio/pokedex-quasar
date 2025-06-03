// pwa.service.ts
import { Injectable, inject, signal } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PwaService {
  private swUpdate = inject(SwUpdate, { optional: true });

  // Signal para controlar se há atualização disponível
  private _updateAvailable = signal(false);
  public updateAvailable = this._updateAvailable.asReadonly();

  constructor() {
    if (this.swUpdate?.isEnabled) {
      this.initializeUpdateListener();
    }
  }

  private initializeUpdateListener(): void {
    if (!this.swUpdate) return;

    // Escuta por atualizações disponíveis
    this.swUpdate.versionUpdates
      .pipe(
        filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'),
        map((evt) => ({
          type: 'UPDATE_AVAILABLE',
          current: evt.currentVersion,
          available: evt.latestVersion,
        }))
      )
      .subscribe((evt) => {
        console.log('Atualização disponível:', evt);
        this._updateAvailable.set(true);
      });
  }

  // Método público para verificar atualizações manualmente
  public checkForUpdates(): void {
    if (!this.swUpdate?.isEnabled) {
      console.warn('Service Worker não está habilitado');
      return;
    }

    this.swUpdate
      .checkForUpdate()
      .then((result) => {
        if (result) {
          console.log('Verificação de atualização: nova versão encontrada');
        } else {
          console.log(
            'Verificação de atualização: nenhuma atualização disponível'
          );
        }
      })
      .catch((err) => {
        console.error('Erro ao verificar atualizações:', err);
      });
  }

  // Método para aplicar a atualização
  public updateApp(): void {
    if (!this.swUpdate?.isEnabled) {
      console.warn('Service Worker não está habilitado');
      return;
    }

    this.swUpdate
      .activateUpdate()
      .then(() => {
        console.log('Atualização aplicada, recarregando...');
        this._updateAvailable.set(false);
        window.location.reload();
      })
      .catch((err) => {
        console.error('Erro ao aplicar atualização:', err);
      });
  }

  // Verifica se o Service Worker está disponível
  public get isSwEnabled(): boolean {
    return this.swUpdate?.isEnabled ?? false;
  }
}
