import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavBarComponent } from 'src/app/theme/layout/admin/nav-bar/nav-bar.component';
import { NavContentComponent } from 'src/app/theme/layout/admin/navigation/nav-content/nav-content.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-clases-ticket',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './clases-ticket.component.html',
  styleUrl: './clases-ticket.component.scss'
})
export class ClasesTicketComponent {

}
