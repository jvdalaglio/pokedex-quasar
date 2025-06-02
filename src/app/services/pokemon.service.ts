import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { forkJoin, Observable, switchMap } from 'rxjs';
import { environment } from '../environments/environment';

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
  private http: HttpClient = inject(HttpClient);
  private apiUrl = environment.apiUrl;

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
