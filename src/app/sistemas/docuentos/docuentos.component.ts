import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-docuentos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './docuentos.component.html',
  styleUrl: './docuentos.component.scss'
})
export class DocuentosComponent implements OnInit, OnDestroy {

    constructor() {}

    ngOnInit(): void {
        throw new Error('Method not implemented.');
    }

    ngOnDestroy(): void {
        throw new Error('Method not implemented.');
    }
}
