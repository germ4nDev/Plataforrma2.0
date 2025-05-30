// Angular Import
import { Component } from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-tbl-styling',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './tbl-styling.component.html',
  styleUrls: ['./tbl-styling.component.scss']
})
export default class TblStylingComponent {}
