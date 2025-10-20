import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-color-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './color-selector.component.html',
  styleUrl: './color-selector.component.scss'
})
export class ColorSelectorComponent {
  @Input() label: string = 'Color Seleccionado';
  @Input() id: string = 'color-picker';
  @Input() initialColor: string = '#1e3a8a'; // Color inicial por defecto

  @Output() colorSelected = new EventEmitter<string>();

  selectedColor: string;

  constructor() {
    this.selectedColor = this.initialColor;
  }

  onColorChange(newColor: string): void {
    this.selectedColor = newColor;
    this.colorSelected.emit(newColor);
    console.log('Nuevo color seleccionado:', newColor);
  }
}
