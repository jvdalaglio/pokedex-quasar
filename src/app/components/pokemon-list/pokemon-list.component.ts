import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  IPokemonDetailsDTO,
  IPokemonListWithDetails,
  PokemonService,
} from '../../services/pokemon.service';
import { PokemonCardComponent } from '../pokemon-card/pokemon-card.component';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [CommonModule, PokemonCardComponent],
  templateUrl: './pokemon-list.component.html',
  providers: [PokemonService],
})
export class PokemonListComponent {
  private pokemonService = inject(PokemonService);
  public pokemons: IPokemonDetailsDTO[] = [];

  ngOnInit(): void {
    this.pokemonService
      .getDetailedPokemons()
      .subscribe((data: IPokemonListWithDetails) => {
        this.pokemons = data.results;
      });
  }
}
