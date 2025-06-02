import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pokemon-list.component.html',
  providers: [PokemonService],
})
export class PokemonListComponent {
  private pokemonService = inject(PokemonService);
  pokemons: any[] = [];

  ngOnInit(): void {
    this.pokemonService.getDetailedPokemons().subscribe((data: any) => {
      this.pokemons = data;
      console.log(this.pokemons);
    });
  }
}
