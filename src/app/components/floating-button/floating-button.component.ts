import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'app-floating-button',
  standalone: true,
  templateUrl: './floating-button.component.html',
  imports: [CommonModule],
})
export class FloatingButtonComponent {
  public stateService = inject(StateService);

  public get tabButtonText(): string {
    return this.stateService.currentTab() === 'main'
      ? 'Ver Favoritos'
      : 'Ver Todos';
  }

  public toggleTab(): void {
    this.stateService.toggleTab();
  }
}
