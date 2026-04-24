import { Component, Input, OnChanges, SimpleChanges, ElementRef, ViewChild, OnDestroy, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import videojs from 'video.js'
import Player from 'video.js/dist/types/player'

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnDestroy {
private _src: string = '';
  player: any;

  // 1. Usamos un SETTER para el Input. Así sabemos cuándo la URL realmente cambia.
  @Input()
  set src(value: string) {
    this._src = value;
    console.log('1. URL recibida:', this._src);
    this.intentarInicializar();
  }
  get src(): string { return this._src; }

  // 2. Usamos un SETTER para el ViewChild. Angular llamará a esta función
  // exactamente cuando la etiqueta <video> ya esté dibujada y lista.
  private videoElement!: ElementRef;
  @ViewChild('target', { static: false })
  set target(content: ElementRef) {
    if (content) {
      this.videoElement = content;
      console.log('2. El elemento de video ya existe en el DOM');
      this.intentarInicializar();
    }
  }

  // 3. El motor que une ambas cosas
  intentarInicializar() {
    // Solo avanzamos si tenemos ambas cosas: la URL y la etiqueta HTML dibujada
    if (!this._src || this._src === 'undefined' || !this.videoElement) {
      return; // Salida silenciosa lógica (aún falta algo)
    }

    console.log('3. Todo listo. Arrancando Video.js...');

    // Si ya había un player viejo, lo matamos
    if (this.player) {
      this.player.dispose();
      this.player = null;
    }

    const options = {
      fluid: true,
      aspectRatio: '16:9',
      controls: true,
      autoplay: false,
      sources: [{ src: this._src, type: 'video/mp4' }]
    };

    // Inicializamos sobre el elemento que guardamos en el setter
    this.player = videojs(this.videoElement.nativeElement, options, () => {
      console.log('4. REPRODUCTOR INICIALIZADO CON ÉXITO');
    });
  }

  ngOnDestroy() {
    if (this.player) {
      this.player.dispose();
    }
  }
  //   @ViewChild('target', { static: true }) target!: ElementRef;
  //   @Input() fluid: boolean = true;
  //   @Input() aspectRatio: string = '16:9';
  //   @Input() autoplay: boolean = false;
  //   @Input() controls: boolean = false;
  //   @Input() src: string = '';
  // //   @Input() type: string = '';

  //   options!: {
  //     fluid: boolean;
  //     aspectRatio: string;
  //     autoplay: boolean;
  //     controls: boolean;
  //     sources: { src: string; type: string }[];
  //   };

  //   player!: Player;

  //   ngOnInit(): void {
  //     console.log('******** Iniciando video player');
  //     this.options.fluid = true
  //     this.options.aspectRatio = '16:9'
  //     this.options.autoplay = false
  //     this.options.controls = true
  //     this.options.sources = [{src: this.src, type: 'video/mp4'}]
  //     console.log('options', this.options);
  //     this.player = videojs(this.target.nativeElement, this.options, () => {
  //       console.log('El reproductor está listo');
  //     });
  //   }

  //   ngOnDestroy(): void {
  //     if (this.player) {
  //       this.player.dispose();
  //     }
  //   }
}
