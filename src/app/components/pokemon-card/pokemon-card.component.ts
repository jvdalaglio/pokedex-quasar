import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IPokemonDetailsDTO } from '../../services/pokemon.service';
import { BadgeComponent } from '../badge/badge.component';

@Component({
  selector: 'app-pokemon-card',
  templateUrl: './pokemon-card.component.html',
  standalone: true,
  imports: [BadgeComponent, CommonModule],
})
export class PokemonCardComponent {
  @Input() pokemon!: IPokemonDetailsDTO;
  public favoriteIds = new Set<number>();

  public toggleFavorite(pokemonId: number): void {
    if (this.favoriteIds.has(pokemonId)) {
      this.favoriteIds.delete(pokemonId);
    } else {
      this.favoriteIds.add(pokemonId);
    }
  }

  public capitalizeFirstLetter(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
}
