import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnInit } from '@angular/core';
import {
  IPokemonDetailsDTO,
  IPokemonListWithDetails,
  PokemonService,
} from '../../services/pokemon.service';
import { StateService } from '../../services/state.service';
import { EmptyStateComponent } from '../empty-state/empty-state.component';
import { FloatingButtonComponent } from '../floating-button/floating-button.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { PokemonCardComponent } from '../pokemon-card/pokemon-card.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [
    CommonModule,
    PokemonCardComponent,
    FloatingButtonComponent,
    SearchBarComponent,
    PaginationComponent,
    EmptyStateComponent,
  ],
  templateUrl: './pokemon-list.component.html',
  providers: [PokemonService],
})
export class PokemonListComponent implements OnInit {
  private pokemonService = inject(PokemonService);
  public stateService = inject(StateService);

  public pokemons: IPokemonDetailsDTO[] = [];
  public filteredPokemons: IPokemonDetailsDTO[] = [];
  public paginatedPokemons: IPokemonDetailsDTO[] = [];

  public searchTerm: string = '';

  public currentPage: number = 1;
  public pageSize: number = 12;
  public totalPages: number = 1;
  public isLoading: boolean = true;

  constructor() {
    effect(() => {
      const currentTab = this.stateService.currentTab();
      console.log('Tab changed to:', currentTab);

      this.currentPage = 1;
      this.searchTerm = '';

      if (this.pokemons.length > 0) {
        this.updateFilteredPokemons();
      }
    });
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.pokemonService.getDetailedPokemons(151).subscribe({
      next: (data: IPokemonListWithDetails) => {
        this.pokemons = data.results;
        this.updateFilteredPokemons();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching Pokemon data:', error);
        this.isLoading = false;
      },
    });
  }

  public get displayedPokemons(): IPokemonDetailsDTO[] {
    const currentTab = this.stateService.currentTab();

    if (currentTab === 'main') {
      return this.pokemons;
    } else {
      return this.pokemons.filter((pokemon) =>
        this.stateService.isFavorite(pokemon.id)()
      );
    }
  }

  public onSearch(): void {
    this.currentPage = 1;
    this.updateFilteredPokemons();
  }

  public updateFilteredPokemons(): void {
    const currentTab = this.stateService.currentTab();
    let baseList =
      currentTab === 'main'
        ? this.pokemons
        : this.pokemons.filter((pokemon) =>
            this.stateService.isFavorite(pokemon.id)()
          );

    if (this.searchTerm.trim() === '') {
      this.filteredPokemons = baseList;
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredPokemons = baseList.filter(
        (pokemon) =>
          pokemon.name.toLowerCase().includes(term) ||
          pokemon.id.toString().includes(term) ||
          pokemon.types.some((type: any) =>
            type.type.name.toLowerCase().includes(term)
          )
      );
    }

    this.calculateTotalPages();
    this.updatePaginatedPokemons();
  }

  private calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.filteredPokemons.length / this.pageSize);
    if (this.totalPages === 0) this.totalPages = 1;
    if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
  }

  private updatePaginatedPokemons(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedPokemons = this.filteredPokemons.slice(startIndex, endIndex);
  }

  public onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePaginatedPokemons();
  }

  public getEmptyStateType(): 'favorites' | 'search' | 'loading' {
    if (this.isLoading) return 'loading';
    if (this.stateService.currentTab() === 'favorites' && !this.searchTerm)
      return 'favorites';
    if (this.filteredPokemons.length === 0 && this.searchTerm) return 'search';
    return 'loading';
  }
}
