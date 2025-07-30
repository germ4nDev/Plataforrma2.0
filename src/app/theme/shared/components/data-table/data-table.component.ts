import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DataTableDirective } from 'angular-datatables';
import { DataTablesModule } from 'angular-datatables';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-data-table',
  standalone: true,
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  imports: [CommonModule, DataTablesModule, TranslateModule]
})
export class DatatableComponent implements AfterViewInit, OnDestroy {
  @Input() data: any[] = [];
  @Input() columns: string[] = [];
  @Input() columnTitles: string[] = [];
  @Input() languageUrl: string = '';
  @Input() exportLabel: string = 'Exportar';
  @Input() showActions: boolean = false;
  @Input() idField: string = 'id';
  @Input() columnFilters: boolean[] = [];

  @Output() editRecord = new EventEmitter<number>();
  @Output() deleteRecord = new EventEmitter<{ id: number; nombre: string }>();

  [x: string]: any;
  @ViewChild(DataTableDirective, { static: false })
  datatableElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {};

  ngAfterViewInit(): void {
    (this.dtOptions as any) = {
      pageLength: 10,
      responsive: true,
      //   dom: `<"dt-toolbar d-flex justify-content-between align-items-center mb-2" <"dt-length"l> <"dt-right-buttons"B>> rt <"dt-footer d-flex justify-content-between align-items-center" i p >`,
      dom: `
    <"dt-toolbar d-flex justify-content-between align-items-center mb-2"
      <"dt-length"l>
      <"dt-right-buttons"B>
    >
    rt
    <"dt-footer d-flex justify-content-between align-items-center"
      i
      p
    >
  `,
      buttons: [
        {
          extend: 'excelHtml5',
          text: `<i class="feather icon-file-text"></i> ${this.exportLabel}`,
          className: 'btn btn-outline-primary',
          action: () => this.exportExcel()
        },
        {
          extend: 'pdfHtml5',
          text: `<i class="feather icon-file-text"></i> Exportar PDF`,
          className: 'btn btn-outline-danger'
        }
      ],
      language: {
        url: this.languageUrl
      }
    };
    console.log('dtoptios', this.dtOptions);

    this.dtTrigger.next(null);
  }

  exportExcel(): void {
    console.log('Exportar Excel emitido');
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  filtrarColumna(index: number, valor: any): void {
    const api = this.datatableElement?.dtInstance;
    if (api) {
      api.then((dt: DataTables.Api) => {
        dt.column(index).search(valor.target.value).draw();
      });
    }
  }

  onEditClick(id: number): void {
    this.editRecord.emit(id);
  }

  onDeleteClick(id: number, nombre: string): void {
    this.deleteRecord.emit({ id, nombre });
  }
}
