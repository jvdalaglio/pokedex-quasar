import {
  Injectable,
  Signal,
  WritableSignal,
  computed,
  effect,
  signal,
} from '@angular/core';

export type TabType = 'main' | 'favorites';

interface AppState {
  favorites: number[];
  lastVisitedPokemon?: number;
  language: 'en' | 'pt';
  theme: 'light' | 'dark';
  currentTab: TabType;
}

const INITIAL_STATE: AppState = {
  favorites: [],
  language: 'pt',
  theme: 'light',
  currentTab: 'main',
};

@Injectable({
  providedIn: 'root',
})
export class StateService {
  private readonly STORAGE_KEY = 'pokedex_app_state';

  private state: WritableSignal<AppState>;

  public favorites: Signal<number[]>;
  public lastVisitedPokemon: Signal<number | undefined>;
  public language: Signal<'en' | 'pt'>;
  public theme: Signal<'light' | 'dark'>;
  public currentTab: Signal<TabType>;

  public isFavorite = (pokemonId: number) =>
    computed(() => this.favorites().includes(pokemonId));

  constructor() {
    const savedState = this.loadStateFromStorage();
    this.state = signal<AppState>(savedState || INITIAL_STATE);

    this.favorites = computed(() => this.state().favorites);
    this.lastVisitedPokemon = computed(() => this.state().lastVisitedPokemon);
    this.language = computed(() => this.state().language);
    this.theme = computed(() => this.state().theme);
    this.currentTab = computed(() => this.state().currentTab);

    effect(() => {
      this.saveStateToStorage(this.state());
    });
  }

  public toggleFavorite(pokemonId: number): void {
    this.state.update((state) => {
      const isFavorite = state.favorites.includes(pokemonId);
      return {
        ...state,
        favorites: isFavorite
          ? state.favorites.filter((id) => id !== pokemonId)
          : [...state.favorites, pokemonId],
      };
    });
  }

  public toggleTab(): void {
    this.state.update((state) => ({
      ...state,
      currentTab: state.currentTab === 'main' ? 'favorites' : 'main',
    }));
  }

  public setCurrentTab(tab: TabType): void {
    this.state.update((state) => ({
      ...state,
      currentTab: tab,
    }));
  }

  private saveStateToStorage(state: AppState): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving state to localStorage:', error);
    }
  }

  private loadStateFromStorage(): AppState | null {
    try {
      const savedState = localStorage.getItem(this.STORAGE_KEY);
      return savedState ? JSON.parse(savedState) : null;
    } catch (error) {
      console.error('Error loading state from localStorage:', error);
      return null;
    }
  }
}
