// Angular Import
import { Component } from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-tbl-border',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './tbl-border.component.html',
  styleUrls: ['./tbl-border.component.scss']
})
export default class TblBorderComponent {}
