// Angular Import
import { Component } from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-tbl-sizing',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './tbl-sizing.component.html',
  styleUrls: ['./tbl-sizing.component.scss']
})
export default class TblSizingComponent {}
