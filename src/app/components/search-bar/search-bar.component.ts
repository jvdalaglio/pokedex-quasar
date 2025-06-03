import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-bar.component.html',
})
export class SearchBarComponent {
  @Input() placeholder: string = 'Buscar Pokémon...';
  @Input() searchTerm: string = '';
  @Output() searchTermChange = new EventEmitter<string>();
  @Output() search = new EventEmitter<void>();

  onInput(): void {
    this.searchTermChange.emit(this.searchTerm);
    this.search.emit();
  }
}
