import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { IPokemonDetailsDTO } from '../../services/pokemon.service';
import { StateService } from '../../services/state.service';
import { BadgeComponent } from '../badge/badge.component';

@Component({
  selector: 'app-pokemon-card',
  templateUrl: './pokemon-card.component.html',
  standalone: true,
  imports: [BadgeComponent, CommonModule],
})
export class PokemonCardComponent {
  @Input() pokemon!: IPokemonDetailsDTO;

  private stateService = inject(StateService);

  public toggleFavorite(pokemonId: number): void {
    this.stateService.toggleFavorite(pokemonId);
  }

  public isFavorite(pokemonId: number): boolean {
    return this.stateService.isFavorite(pokemonId)();
  }

  public capitalizeFirstLetter(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
}
