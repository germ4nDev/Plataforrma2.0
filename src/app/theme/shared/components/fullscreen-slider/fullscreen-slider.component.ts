/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
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
export class FullScreenSliderComponent implements OnInit, OnDestroy {
  @Input() tipoSlider: number = 0;
  autoSlideInterval: number = 7000;
  registrosSub?: Subscription;
  registros: PTLSlierInicioModel[] = [];
  currentIndex: number = 0;
  images: PTLSlierInicioModel[] = [];
  private readonly defaultPlaceholder = `${base_url}/upload/sliders/imagen-inicio.png`;
  private intervalId: any;

  constructor(private _sliderService: PtlSlidersInicioService) {}

  ngOnInit(): void {
    if (this.tipoSlider == 1) {
      this.consultarRegistros();
    } else if (this.tipoSlider == 2) {
        const newImage = {
            nombreslider: 'Ner Image',
            urlSlider: 'imagen-inicio.png',
            imageSlider: `${base_url}/upload/sliders/imagen-inicio.png`
        }
        this.images.push(newImage);
    }
  }

  ngOnDestroy(): void {
    // Limpiar el temporizador al destruir el componente
    this.stopAutoSlide();
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
            this.startAutoSlide();
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

  private startAutoSlide(): void {
    if (this.images.length > 1 && this.autoSlideInterval > 0) {
      this.intervalId = setInterval(() => {
        this.nextImage();
      }, this.autoSlideInterval);
    }
  }

  private stopAutoSlide(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private resetAutoSlide(): void {
    this.stopAutoSlide();
    this.startAutoSlide();
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
