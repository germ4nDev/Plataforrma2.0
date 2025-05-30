
// angular import
import { Component, OnInit } from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { RouterModule } from '@angular/router';
import { Router, ActivatedRoute } from '@angular/router';

// bootstrap import
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

// third party
import { ColorPickerModule } from 'ngx-color-picker';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [NgbDropdownModule, RouterModule, ColorPickerModule, SharedModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent implements OnInit {

    constructor (
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit(): void {
        console.log('ingresa a la plataforma');
    }

    ingresarPlataforma() {
        const appId = 'asdfas-sdafsd-asdfsdf';
        localStorage.setItem('aplicacionId', appId)
        this.router.navigate(['/dashboard/analytics']);
    }
}

