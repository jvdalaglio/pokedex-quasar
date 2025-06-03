import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './badge.component.html',
})
export class BadgeComponent {
  @Input() type: string = '';

  private translationService = inject(TranslationService);

  get translatedType(): string {
    return this.translationService.getTypeTranslation(this.type);
  }
}
