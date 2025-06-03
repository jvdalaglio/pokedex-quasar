import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { forkJoin, map, Observable, of, switchMap } from 'rxjs'; // Adicionado 'map' e 'of'
import { environment } from '../environments/environment';

export interface IPokemonResultsDTO {
  name: string;
  url: string;
}

export interface IDefaultResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T;
}

export interface IPokemonDetailsDTO {
  id: number;
  name: string;
  sprites: any;
  types: any;
  stats: any;
}

export interface IPokemonListWithDetails {
  count: number;
  next: string | null;
  previous: string | null;
  results: IPokemonDetailsDTO[];
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
  ): Observable<IPokemonListWithDetails> {
    return this.http
      .get<IDefaultResponse<IPokemonResultsDTO[]>>(
        `${this.apiUrl}/pokemon?limit=${limit ?? 20}&offset=${offset ?? 0}`
      )
      .pipe(
        switchMap((response: IDefaultResponse<IPokemonResultsDTO[]>) => {
          if (!response.results || response.results.length === 0) {
            return of({
              count: response.count,
              next: response.next,
              previous: response.previous,
              results: [],
            });
          }

          const detailRequests: Observable<IPokemonDetailsDTO>[] =
            response.results.map((pokemonResult: IPokemonResultsDTO) =>
              this.http.get<IPokemonDetailsDTO>(pokemonResult.url)
            );

          return forkJoin(detailRequests).pipe(
            map((detailedPokemons: IPokemonDetailsDTO[]) => {
              return {
                count: response.count,
                next: response.next,
                previous: response.previous,
                results: detailedPokemons,
              };
            })
          );
        })
      );
  }
}
