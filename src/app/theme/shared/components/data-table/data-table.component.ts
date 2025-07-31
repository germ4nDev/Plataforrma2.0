// import { CommonModule } from '@angular/common';
// import { Component, Input, Output, EventEmitter, ViewChild, AfterViewInit, OnDestroy, OnInit } from '@angular/core';
// import { TranslateModule } from '@ngx-translate/core';
// import { DataTableDirective } from 'angular-datatables';
// import { DataTablesModule } from 'angular-datatables';
// import { Subject } from 'rxjs';
// import { LanguageService } from '../../service';

// @Component({
//   selector: 'app-data-table',
//   standalone: true,
//   templateUrl: './data-table.component.html',
//   styleUrls: ['./data-table.component.scss'],
//   imports: [CommonModule, DataTablesModule, TranslateModule]
// })
// export class DatatableComponent implements OnInit, AfterViewInit, OnDestroy {
//   @Input() data: any[] = [];
//   @Input() columns: string[] = [];
//   @Input() columnTitles: string[] = [];
//   @Input() languageUrl: string = '';
//   @Input() exportLabel: string = 'Exportar';
//   @Input() showActions: boolean = true;
//   @Input() idField: string = 'id';
//   @Input() columnFilters: boolean[] = [];
//   @Input() buttonsPosition: 'left' | 'right' = 'right';
//   @Input() showLengthSelector: boolean = true;
//   @Input() showSearchBox: boolean = true;

//   @Output() editRecord = new EventEmitter<number>();
//   @Output() deleteRecord = new EventEmitter<{ id: number; nombre: string }>();

//   [x: string]: any;
//   @ViewChild(DataTableDirective, { static: false })
//   datatableElement!: DataTableDirective;
//   dtTrigger: Subject<any> = new Subject<any>();
//   dtOptions: DataTables.Settings = {};

//   constructor(private languageService: LanguageService) {}

//   ngOnInit(): void {
//     (this.dtOptions as any) = {
//       pageLength: 10,
//       responsive: true,
//       dom: `
//       <"dt-toolbar d-flex justify-content-between align-items-center mb-2"
//         ${this.showLengthSelector ? '<"dt-length"l>' : ''}
//         ${this.buttonsPosition === 'right' ? '<"dt-right-buttons"B>' : '<"dt-left-buttons"B>'}
//       >
//       rt
//       <"dt-footer d-flex justify-content-between align-items-center" i p >
//     `,
//       buttons: [
//         {
//           extend: 'excelHtml5',
//           text: `<i class="feather icon-file-text"></i> ${this.exportLabel}`,
//           className: 'btn btn-outline-primary',
//           action: () => this.exportExcel()
//         }
//       ],
//       language: this.getLanguageSettings()
//     };
//     this.languageService.currentLang$.subscribe((lang: any) => {
//       console.log('lang datatable', lang);
//       this.getLanguageSettings();
//       this.reRenderDataTable();
//     });
//   }

//   ngAfterViewInit(): void {
//     this.dtTrigger.next(null);

//     if (!this.showSearchBox) {
//       setTimeout(() => {
//         const inputWrapper = document.querySelector('.dataTables_filter');
//         if (inputWrapper) (inputWrapper as HTMLElement).style.display = 'none';
//       }, 0);
//     }
//   }

//   exportExcel(): void {
//     console.log('Exportar Excel emitido');
//   }

//   ngOnDestroy(): void {
//     this.dtTrigger.unsubscribe();
//     // this.langSub?.unsubscribe();
//   }

//   filtrarColumna(index: number, valor: any): void {
//     const api = this.datatableElement?.dtInstance;
//     if (api) {
//       api.then((dt: DataTables.Api) => {
//         dt.column(index).search(valor.target.value).draw();
//       });
//     }
//   }

//   onEditClick(id: number): void {
//     this.editRecord.emit(id);
//   }

//   onDeleteClick(id: number, nombre: string): void {
//     this.deleteRecord.emit({ id, nombre });
//   }

//   getLanguageSettings(): any {
//     const lang = localStorage.getItem('lang') || 'es';

//     const languages: Record<string, any> = {
//       es: {
//         processing: 'Procesando...',
//         search: 'Buscar:',
//         lengthMenu: 'Mostrar _MENU_ registros',
//         info: 'Mostrando _START_ a _END_ de _TOTAL_ registros',
//         infoEmpty: 'Mostrando 0 a 0 de 0 registros',
//         infoFiltered: '(filtrado de _MAX_ registros totales)',
//         loadingRecords: 'Cargando...',
//         zeroRecords: 'No se encontraron registros coincidentes',
//         emptyTable: 'No hay datos disponibles en la tabla',
//         paginate: {
//           first: 'Primero',
//           previous: 'Anterior',
//           next: 'Siguiente',
//           last: 'Último'
//         },
//         buttons: {
//           excel: 'Exportar a Excel',
//           pdf: 'Exportar a PDF'
//         }
//       },
//       en: {
//         processing: 'Processing...',
//         search: 'Search:',
//         lengthMenu: 'Show _MENU_ entries',
//         info: 'Showing _START_ to _END_ of _TOTAL_ entries',
//         infoEmpty: 'Showing 0 to 0 of 0 entries',
//         infoFiltered: '(filtered from _MAX_ total entries)',
//         loadingRecords: 'Loading...',
//         zeroRecords: 'No matching records found',
//         emptyTable: 'No data available in table',
//         paginate: {
//           first: 'First',
//           previous: 'Previous',
//           next: 'Next',
//           last: 'Last'
//         },
//         buttons: {
//           excel: 'Export to Excel',
//           pdf: 'Export to PDF'
//         }
//       }
//     };

//     return languages[lang] || languages['es'];
//   }

//   private reRenderDataTable(): void {
//     if (this.datatableElement && this.datatableElement.dtInstance) {
//       this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
//         dtInstance.destroy();
//         this.ngAfterViewInit();
//       });
//     }
//   }
// }


// import { CommonModule } from '@angular/common';
// import { Component, Input, Output, EventEmitter, ViewChild, AfterViewInit, OnDestroy, OnInit } from '@angular/core';
// import { TranslateModule } from '@ngx-translate/core';
// import { DataTableDirective } from 'angular-datatables';
// import { DataTablesModule } from 'angular-datatables';
// import { Subject, Subscription } from 'rxjs';
// import { LanguageService } from '../../service';

// @Component({
//   selector: 'app-data-table',
//   standalone: true,
//   templateUrl: './data-table.component.html',
//   styleUrls: ['./data-table.component.scss'],
//   imports: [CommonModule, DataTablesModule, TranslateModule]
// })
// export class DatatableComponent implements OnInit, AfterViewInit, OnDestroy {
//   @Input() data: any[] = [];
//   @Input() columns: string[] = [];
//   @Input() columnTitles: string[] = [];
//   @Input() exportLabel: string = 'Exportar';
//   @Input() showActions: boolean = true;
//   @Input() idField: string = 'id';
//   @Input() columnFilters: boolean[] = [];
//   @Input() buttonsPosition: 'left' | 'right' = 'right';
//   @Input() showLengthSelector: boolean = true;
//   @Input() showSearchBox: boolean = true;

//   @Output() editRecord = new EventEmitter<number>();
//   @Output() deleteRecord = new EventEmitter<{ id: number; nombre: string }>();

//   @ViewChild(DataTableDirective, { static: false })
//   datatableElement!: DataTableDirective;
//   dtTrigger: Subject<any> = new Subject<any>();
//   dtOptions: DataTables.Settings = {};
//   currentLang: string = 'es';

//   private langChangeSub?: Subscription;

//   constructor(private languageService: LanguageService) {}

//   ngOnInit(): void {
//     this.initDataTable();
//     this.langChangeSub = this.languageService.currentLang$.subscribe((lang: any) => {
//       this.currentLang = lang;
//       this.reRenderDataTable();
//     });
//   }

//   ngAfterViewInit(): void {
//     this.dtTrigger.next(null);

//     if (!this.showSearchBox) {
//       setTimeout(() => {
//         const inputWrapper = document.querySelector('.dataTables_filter');
//         if (inputWrapper) (inputWrapper as HTMLElement).style.display = 'none';
//       }, 0);
//     }
//   }

//   initDataTable(): void {
//     (this.dtOptions as any) = {
//       pageLength: 10,
//       responsive: true,
//       dom: `<"dt-toolbar d-flex justify-content-between align-items-center mb-2"
//              ${this.showLengthSelector ? '<"dt-length"l>' : ''}
//              ${this.buttonsPosition === 'right' ? '<"dt-right-buttons"B>' : '<"dt-left-buttons"B>'}>
//            rt
//            <"dt-footer d-flex justify-content-between align-items-center" i p >`,
//       buttons: [
//         {
//           extend: 'excelHtml5',
//           text: `<i class="feather icon-file-text"></i> ${this.exportLabel}`,
//           className: 'btn btn-outline-primary',
//           action: () => this.exportExcel()
//         },
//         {
//           extend: 'pdfHtml5',
//           text: `<i class="feather icon-file-text"></i> Exportar PDF`,
//           className: 'btn btn-outline-danger'
//         }
//       ],
//       language: this.getLanguageSettings()
//     };
//   }

//   getLanguageSettings(): any {
//     const lang = this.currentLang || 'es';

//     const languages: Record<string, any> = {
//       es: {
//         processing: 'Procesando...',
//         search: 'Buscar:',
//         lengthMenu: 'Mostrar _MENU_ registros',
//         info: 'Mostrando _START_ a _END_ de _TOTAL_ registros',
//         infoEmpty: 'Mostrando 0 a 0 de 0 registros',
//         infoFiltered: '(filtrado de _MAX_ registros totales)',
//         loadingRecords: 'Cargando...',
//         zeroRecords: 'No se encontraron registros coincidentes',
//         emptyTable: 'No hay datos disponibles en la tabla',
//         paginate: {
//           first: 'Primero',
//           previous: 'Anterior',
//           next: 'Siguiente',
//           last: 'Último'
//         },
//         buttons: {
//           excel: 'Exportar a Excel',
//           pdf: 'Exportar a PDF'
//         }
//       },
//       en: {
//         processing: 'Processing...',
//         search: 'Search:',
//         lengthMenu: 'Show _MENU_ entries',
//         info: 'Showing _START_ to _END_ of _TOTAL_ entries',
//         infoEmpty: 'Showing 0 to 0 of 0 entries',
//         infoFiltered: '(filtered from _MAX_ total entries)',
//         loadingRecords: 'Loading...',
//         zeroRecords: 'No matching records found',
//         emptyTable: 'No data available in table',
//         paginate: {
//           first: 'First',
//           previous: 'Previous',
//           next: 'Next',
//           last: 'Last'
//         },
//         buttons: {
//           excel: 'Export to Excel',
//           pdf: 'Export to PDF'
//         }
//       }
//     };

//     return languages[lang] || languages['es'];
//   }

//   reRenderDataTable(): void {
//     if (this.datatableElement && this.datatableElement.dtInstance) {
//       this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
//         dtInstance.destroy();
//         this.initDataTable();
//         this.dtTrigger.next(null);
//       });
//     }
//   }

//   exportExcel(): void {
//     console.log('Exportar Excel emitido');
//   }

//   ngOnDestroy(): void {
//     this.dtTrigger.unsubscribe();
//     this.langChangeSub?.unsubscribe();
//   }

//   filtrarColumna(index: number, valor: any): void {
//     const api = this.datatableElement?.dtInstance;
//     if (api) {
//       api.then((dt: DataTables.Api) => {
//         dt.column(index).search(valor.target.value).draw();
//       });
//     }
//   }

//   onEditClick(id: number): void {
//     this.editRecord.emit(id);
//   }

//   onDeleteClick(id: number, nombre: string): void {
//     this.deleteRecord.emit({ id, nombre });
//   }
// }

import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, ViewChild, AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DataTableDirective } from 'angular-datatables';
import { DataTablesModule } from 'angular-datatables';
import { Subject, Subscription } from 'rxjs';
import { LanguageService } from '../../service';

@Component({
  selector: 'app-data-table',
  standalone: true,
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  imports: [CommonModule, DataTablesModule, TranslateModule]
})
export class DatatableComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() data: any[] = [];
  @Input() columns: string[] = [];
  @Input() tableTitle: string = 'Tabla';
  @Input() columnTitles: string[] = [];
  @Input() exportLabel: string = 'Exportar';
  @Input() newRecordLabel: string = 'Nuevo';
  @Input() showActions: boolean = true;
  @Input() idField: string = 'id';
  @Input() columnFilters: boolean[] = [];
  @Input() buttonsPosition: 'left' | 'right' = 'right';
  @Input() showLengthSelector: boolean = true;
  @Input() showSearchBox: boolean = true;
  @Input() showNewButton: boolean = false;

  @Output() newRecord = new EventEmitter<void>();
  @Output() editRecord = new EventEmitter<number>();
  @Output() deleteRecord = new EventEmitter<{ id: number; nombre: string }>();

  @ViewChild(DataTableDirective, { static: false })
  datatableElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {};
  currentLang: string = 'es';

  private langChangeSub?: Subscription;

  constructor(private languageService: LanguageService) {}

  ngOnInit(): void {
    this.initDataTable();
    this.langChangeSub = this.languageService.currentLang$.subscribe((lang: any) => {
      this.currentLang = lang;
      this.reRenderDataTable();
    });
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(null);

    if (!this.showSearchBox) {
      setTimeout(() => {
        const inputWrapper = document.querySelector('.dataTables_filter');
        if (inputWrapper) (inputWrapper as HTMLElement).style.display = 'none';
      }, 0);
    }
  }

  initDataTable(): void {
    (this.dtOptions as any) = {
      pageLength: 10,
      responsive: true,
      dom: `<"dt-toolbar d-flex justify-content-between align-items-center mb-2"
             ${this.showLengthSelector ? '<"dt-length"l>' : ''}
             <"dt-center-title"> <"dt-right-buttons"B>>
           rt
           <"dt-footer d-flex justify-content-between align-items-center" i p >`,
      buttons: [
        {
          extend: 'excelHtml5',
          text: `<i class="feather icon-file-text"></i> ${this.exportLabel}`,
          className: 'btn btn-NuevoRegistro',
          action: () => this.exportExcel()
        },
        {
          text: `${this.newRecordLabel}`,
          className: 'btn btn-NuevoRegistro',
          action: () => this.onNewClick(),
          enabled: this.showNewButton
        }
      ],
      language: this.getLanguageSettings()
    };
  }

  getLanguageSettings(): any {
    const lang = this.currentLang || 'es';

    const languages: Record<string, any> = {
      es: {
        processing: 'Procesando...',
        search: 'Buscar:',
        lengthMenu: 'Mostrar _MENU_ registros',
        info: 'Mostrando _START_ a _END_ de _TOTAL_ registros',
        infoEmpty: 'Mostrando 0 a 0 de 0 registros',
        infoFiltered: '(filtrado de _MAX_ registros totales)',
        loadingRecords: 'Cargando...',
        zeroRecords: 'No se encontraron registros coincidentes',
        emptyTable: 'No hay datos disponibles en la tabla',
        paginate: {
          first: 'Primero',
          previous: 'Anterior',
          next: 'Siguiente',
          last: 'Último'
        },
        buttons: {
          excel: 'Exportar a Excel',
          pdf: 'Exportar a PDF'
        }
      },
      en: {
        processing: 'Processing...',
        search: 'Search:',
        lengthMenu: 'Show _MENU_ entries',
        info: 'Showing _START_ to _END_ of _TOTAL_ entries',
        infoEmpty: 'Showing 0 to 0 of 0 entries',
        infoFiltered: '(filtered from _MAX_ total entries)',
        loadingRecords: 'Loading...',
        zeroRecords: 'No matching records found',
        emptyTable: 'No data available in table',
        paginate: {
          first: 'First',
          previous: 'Previous',
          next: 'Next',
          last: 'Last'
        },
        buttons: {
          excel: 'Export to Excel',
          pdf: 'Export to PDF'
        }
      }
    };

    return languages[lang] || languages['es'];
  }

  reRenderDataTable(): void {
    if (this.datatableElement && this.datatableElement.dtInstance) {
      this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.initDataTable();
        this.dtTrigger.next(null);
      });
    }
  }

  exportExcel(): void {
    console.log('Exportar Excel emitido');
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    this.langChangeSub?.unsubscribe();
  }

  filtrarColumna(index: number, valor: any): void {
    const api = this.datatableElement?.dtInstance;
    if (api) {
      api.then((dt: DataTables.Api) => {
        dt.column(index).search(valor.target.value).draw();
      });
    }
  }

  onNewClick(): void {
    this.newRecord.emit();
  }

  onEditClick(id: number): void {
    this.editRecord.emit(id);
  }

  onDeleteClick(id: number, nombre: string): void {
    this.deleteRecord.emit({ id, nombre });
  }
}
