import { Component, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

// Definición de las interfaces para estructurar la paleta
interface ColorChip {
  hex: string;
  intensity: number; // 50, 100, 200... 900
}

interface ColorGroup {
  name: string;
  chips: ColorChip[];
}

@Component({
  selector: 'app-color-picker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './color-picker.component.html',
  styleUrl: './color-picker.component.scss'
})
export class ColorPickerComponent {
  @Output() colorSelected = new EventEmitter<string>();

  colorGroups: ColorGroup[] = [
    { name: 'Blue', chips: this.generateScale('#3b82f6') },
    { name: 'Indigo', chips: this.generateScale('#6366f1') },
    { name: 'Violet', chips: this.generateScale('#8b5cf6') },
    { name: 'Fuchsia', chips: this.generateScale('#d946ef') },
    { name: 'Pink', chips: this.generateScale('#ec4899') },
    { name: 'Red', chips: this.generateScale('#ef4444') },
    { name: 'Orange', chips: this.generateScale('#f97316') },
    { name: 'Amber', chips: this.generateScale('#f59e0b') },
    { name: 'Yellow', chips: this.generateScale('#eab308') },
    { name: 'Lime', chips: this.generateScale('#84cc16') },
    { name: 'Green', chips: this.generateScale('#22c55e') },
    { name: 'Emerald', chips: this.generateScale('#10b981') },
    { name: 'Teal', chips: this.generateScale('#14b8a6') },
    { name: 'Cyan', chips: this.generateScale('#06b6d4') },
    { name: 'Gray', chips: this.generateScale('#6b7280') }
  ];

  selectedColor = signal<string>(this.colorGroups[0].chips[5].hex); // Default: Azul 500

  constructor() {
    this.updateShadowColor(this.selectedColor());
    this.colorSelected.emit(this.selectedColor());
  }

  private generateScale(baseHex: string): ColorChip[] {
    const tones = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
    const scale: ColorChip[] = [];

    const simulatedPalettes: { [key: string]: string[] } = {
      '#3b82f6': ['#eff6ff', '#dbeafe', '#bfdbfe', '#93c5fd', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8', '#1e40af', '#1e3a8a'], // Blue
      '#6366f1': ['#eef2ff', '#e0e7ff', '#c7d2fe', '#a5b4fc', '#818cf8', '#6366f1', '#4f46e5', '#4338ca', '#3730a3', '#312e81'], // Indigo
      '#8b5cf6': ['#f5f3ff', '#ede9fe', '#ddd6fe', '#c4b5fd', '#a78bfa', '#8b5cf6', '#7c3aed', '#6d28d9', '#5b21b6', '#4c1d95'], // Violet
      '#d946ef': ['#fdf4ff', '#fae8ff', '#f3e8ff', '#e9d5ff', '#d8b4fe', '#c084fc', '#a855f7', '#9333ea', '#7e22ce', '#6b21a8'], // Fuchsia
      '#ec4899': ['#fce7f3', '#fbcfe8', '#f9a8d4', '#f472b6', '#e879f9', '#db2777', '#be188a', '#9d174d', '#831843', '#701a45'], // Pink
      '#ef4444': ['#fef2f2', '#fee2e2', '#fecaca', '#fca5a5', '#f87171', '#ef4444', '#dc2626', '#b91c1c', '#991b1b', '#7f1d1d'], // Red
      '#f97316': ['#fff7ed', '#ffedd5', '#fed7aa', '#fdba74', '#fb923c', '#f97316', '#ea580c', '#c2410c', '#9a3412', '#7c2d12'], // Orange
      '#f59e0b': ['#fffdfa', '#fef3c7', '#fde68a', '#fcd34d', '#fbbf24', '#f59e0b', '#d97706', '#b45309', '#92400e', '#78350f'], // Amber
      '#eab308': ['#fefce8', '#faf089', '#fce303', '#f9e71d', '#f6d220', '#eab308', '#ca8a04', '#a16207', '#854d0e', '#713f12'], // Yellow
      '#84cc16': ['#f7fee7', '#ecfccb', '#d9f99d', '#bef264', '#a3e635', '#84cc16', '#65a30d', '#4d7c0f', '#3f6212', '#365314'], // Lime
      '#22c55e': ['#f0fdf4', '#dcfce7', '#bbf7d0', '#86efad', '#4ade80', '#22c55e', '#16a34a', '#15803d', '#14532d', '#052e16'], // Green
      '#10b981': ['#f0fdfa', '#ccfbf1', '#99f6e4', '#5eead4', '#2dd4bf', '#10b981', '#059669', '#047857', '#065f46', '#064e3b'], // Emerald
      '#14b8a6': ['#f0fdfa', '#ccfbf1', '#99f6e4', '#5eead4', '#2dd4bf', '#14b8a6', '#0d9488', '#0f766e', '#115e59', '#134e4a'], // Teal
      '#06b6d4': ['#f0f9ff', '#e0f6ff', '#bae6fd', '#7dd3fc', '#38bdf8', '#06b6d4', '#0891b2', '#0e7490', '#155e75', '#164e63'], // Cyan
      '#6b7280': ['#f9fafb', '#f3f4f6', '#e5e7eb', '#d1d5db', '#9ca3af', '#6b7280', '#4b5563', '#374151', '#1f2937', '#111827']  // Gray
    };

    const palette = simulatedPalettes[baseHex] || simulatedPalettes['#3b82f6']; // Fallback to Blue

    for (let i = 0; i < tones.length; i++) {
      scale.push({
        hex: palette[i],
        intensity: tones[i]
      });
    }
    return scale;
  }

  private updateShadowColor(hex: string) {
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    const shadowColor = luminance > 0.6 ? '#333' : '#fff'; // Oscuro si es claro, claro si es oscuro
    document.documentElement.style.setProperty('--selected-shadow-color', shadowColor);
  }

  selectColor(hex: string) {
    this.selectedColor.set(hex);
    this.updateShadowColor(hex);
    this.colorSelected.emit(hex);
  }
}
