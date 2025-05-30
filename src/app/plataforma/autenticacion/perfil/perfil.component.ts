// angular import
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [SharedModule, RouterModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent {
    // public props
    radioButtons: string;

    // constructor
    constructor() {
        this.radioButtons = 'f';
    }
}
