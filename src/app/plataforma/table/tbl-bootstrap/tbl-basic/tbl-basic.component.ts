// Angular Import
import { Component } from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-tbl-basic',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './tbl-basic.component.html',
  styleUrls: ['./tbl-basic.component.scss']
})
export default class TblBasicComponent {}
