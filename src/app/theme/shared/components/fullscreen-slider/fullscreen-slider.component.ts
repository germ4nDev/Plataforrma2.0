/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PtlSlidersInicioService } from '../../service/ptlsliders-inicio.service';
import { of, Subscription } from 'rxjs';
import { PTLSlierInicioModel } from '../../_helpers/models/PTLSliderInicio.model';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const base_url = environment.apiUrl;

@Component({
  selector: 'app-full-screen-slider',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './fullscreen-slider.component.html',
  styleUrl: './fullscreen-slider.component.scss'
})
export class FullScreenSliderComponent implements OnInit {
  registrosSub?: Subscription;
  registros: PTLSlierInicioModel[] = [];
  currentIndex: number = 0;
  images: PTLSlierInicioModel[] = [];
  private readonly defaultPlaceholder = `${base_url}/upload/sliders/imagen-inicio.png`;

  constructor(private _sliderService: PtlSlidersInicioService) {}

  ngOnInit(): void {
    this.consultarRegistros();
  }

  consultarRegistros() {
    this.registrosSub = this._sliderService
      .getRegistros()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            resp.slidersInicio.forEach((slider: any) => {
              slider.imageSlider = `${base_url}/upload/sliders/${slider.urlSlider}`;
            });
              console.warn('FullscreenSliderComponent: No se proporcionaron imágenes. Se mostrará un placeholder.');
              this.images = resp.slidersInicio;
              console.log('slider images', this.images);
            console.log('Todos las sliders', this.images);
            return;
          }
        }),
        catchError((err) => {
          console.log('Ha ocurrido un error', err);
          return of(null);
        })
      )
      .subscribe();
  }

  nextImage(): void {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  prevImage(): void {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  goToImage(index: number): void {
    if (index >= 0 && index < this.images.length) {
      this.currentIndex = index;
    }
  }

  onImageError(event: Event, index: number): void {
    const imgElement = event.target as HTMLImageElement;
    console.error(`Error al cargar la imagen en el índice ${index}: ${imgElement.src}`);
    // Reemplazar la URL por el placeholder solo si no es ya el placeholder
    if (imgElement.src !== this.defaultPlaceholder) {
      imgElement.src = this.defaultPlaceholder;
    }
  }
}
