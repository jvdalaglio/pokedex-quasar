import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, switchMap } from 'rxjs';

export interface Pokemon {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Pokemon[];
}

export interface PokemonDetails {
  id: number;
  name: string;
  sprites: any;
  types: any;
  stats: any;
}

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private apiUrl = 'https://pokeapi.co/api/v2';

  constructor(private http: HttpClient) {}

  getDetailedPokemons(
    limit?: number,
    offset?: number
  ): Observable<PokemonDetails[]> {
    return this.http
      .get<PokemonListResponse>(
        `${this.apiUrl}/pokemon?limit=${limit ?? 20}&offset=${offset ?? 0}`
      )
      .pipe(
        switchMap((res) => {
          const requests = res.results.map((p) =>
            this.http.get<PokemonDetails>(p.url)
          );
          return forkJoin(requests);
        })
      );
  }
}
