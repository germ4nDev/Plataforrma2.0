// import { CommonModule } from '@angular/common';
// import { Component, Input, Output, EventEmitter, ViewChild, AfterViewInit, OnDestroy, OnInit, ElementRef, Renderer2 } from '@angular/core';
// import { TranslateModule, TranslateService } from '@ngx-translate/core';
// import { DataTableDirective } from 'angular-datatables';
// import { DataTablesModule } from 'angular-datatables';
// import { Subject, Subscription } from 'rxjs';
// import { LanguageService } from '../../service';
// import { HttpClient } from '@angular/common/http';

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
//   @Input() newButtonLabel: string = 'Nueva Aplicación';
//   @Input() showActions: boolean = true;
//   @Input() idField: string = 'id';
//   @Input() columnFilters: boolean[] = [];
//   @Input() showSearchBox: boolean = true;
//   @Input() tableTitle: string = '';
//   @Input() showNewButton: boolean = false;
//   @Input() buttonsClass: string = 'btn btn-primary';

//   @Output() newRecord = new EventEmitter<void>();
//   @Output() editRecord = new EventEmitter<number>();
//   @Output() deleteRecord = new EventEmitter<{ id: number; nombre: string }>();

//   @ViewChild(DataTableDirective, { static: false })
//   datatableElement!: DataTableDirective;
//   dtTrigger: Subject<any> = new Subject<any>();
//   dtOptions: DataTables.Settings = {};
//   currentLang: string = 'es';

//   private langChangeSub?: Subscription;

//   constructor(
//     private languageService: LanguageService,
//     private http: HttpClient, // Necesario para la traducción
//     private translateService: TranslateService // Necesario para la traducción
//   ) {}

//   ngOnInit(): void {
//     this.currentLang = localStorage.getItem('lang') || 'es';
//     this.initDataTable();
//     this.langChangeSub = this.languageService.currentLang$.subscribe((lang: string) => {
//       this.currentLang = lang;
//       this.reRenderDataTable();
//     });
//   }

//   ngAfterViewInit(): void {
//     // 1. Dispara el renderizado inicial de la tabla
//     this.dtTrigger.next(null);

//     // 2. Oculta la caja de búsqueda si el input showSearchBox es falso
//     if (!this.showSearchBox) {
//       setTimeout(() => {
//         const inputWrapper = document.querySelector('.dataTables_filter');
//         if (inputWrapper) (inputWrapper as HTMLElement).style.display = 'none';
//       }, 0);
//     }

//     // 3. Adjunta los manejadores de eventos a los botones de acción
//     this.onActionsClick();
//   }

//   initDataTable(): void {
//     if (!this.columns || this.columns.length === 0 || !this.columnTitles || this.columnTitles.length !== this.columns.length) {
//       console.error('Los arrays de columnas o de títulos no son válidos.');
//       return;
//     }

//     const columnDefs: DataTables.ColumnSettings[] = this.columns.map((col, index) => {
//       return { data: col, title: this.columnTitles[index] };
//     });

//     if (this.showActions) {
//       columnDefs.push({
//         data: null,
//         title: this.translateService.instant('GLOBAL.ACTIONS'),
//         orderable: false,
//         searchable: false,
//         render: (data: any, type: any, row: any) => {
//           // Esta función renderiza el HTML de los botones
//           return `<button class="btn btn-sm btn-outline-primary me-1 edit-button" data-id="${row[this.idField]}">
//             <i class="feather icon-edit"></i>
//           </button>
//           <button class="btn btn-sm btn-outline-danger delete-button" data-id="${row[this.idField]}" data-nombre="${row['nombre']}">
//             <i class="feather icon-trash"></i>
//           </button>`;
//         }
//       });
//     }

//     (this.dtOptions as any) = {
//       pageLength: 10,
//       responsive: true,
//       dom: `
//         <"dt-toolbar d-flex justify-content-between align-items-center mb-2"lB>
//         rt
//         <"dt-footer d-flex justify-content-between align-items-center"ip>
//       `,
//       buttons: [
//         {
//           extend: 'excelHtml5',
//           text: `<i class="feather icon-file-text"></i> ${this.exportLabel}`,
//           className: 'btn-NuevoRegistro',
//           action: () => this.exportExcel()
//         },
//         {
//           text: `<i class="feather icon-plus"></i> ${this.newButtonLabel}`,
//           className: 'btn-NuevoRegistro',
//           action: () => this.newRecord.emit(),
//           enabled: this.showNewButton
//         }
//       ],
//       language: this.getLanguageSettings(),
//       columns: columnDefs
//     };
//   }

//   // Nuevo método para manejar los clics
//   onActionsClick(): void {
//     // Usamos event delegation para capturar los clics
//     $(document).on('click', '.edit-button', (event: any) => {
//       const id = $(event.target).closest('button').data('id');
//       this.editRecord.emit(id);
//     });

//     $(document).on('click', '.delete-button', (event: any) => {
//       const button = $(event.target).closest('button');
//       const id = button.data('id');
//       const nombre = button.data('nombre');
//       this.deleteRecord.emit({ id: id, nombre: nombre });
//     });
//   }

//   reRenderDataTable(): void {
//     // Se asegura de que la tabla solo se re-renderice si los datos y las columnas son válidos.
//     if (this.datatableElement && this.datatableElement.dtInstance && this.data && this.columns && this.columns.length > 0) {
//       this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
//         dtInstance.destroy();
//         this.initDataTable();
//         this.dtTrigger.next(null);
//       });
//     } else {
//       // Si los datos o las columnas no son válidos, solo se re-inicializa si no hay instancia.
//       if (!this.datatableElement || !this.datatableElement.dtInstance) {
//         this.initDataTable();
//         this.dtTrigger.next(null);
//       }
//     }
//   }

//   ngOnDestroy(): void {
//     this.dtTrigger.unsubscribe();
//     this.langChangeSub?.unsubscribe();
//   }

//   updateLanguageAndRedraw(): void {
//     if (this.datatableElement && this.datatableElement.dtInstance) {
//       this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
//         dtInstance.settings()[0].oLanguage = this.getLanguageSettings();
//         dtInstance.draw();
//       });
//     }
//   }

//   getLanguageSettings(): any {
//     const lang = this.currentLang;
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

//   onNewClick(): void {
//     this.newRecord.emit();
//   }

//   exportExcel(): void {
//     const dtInstance = this.datatableElement.dtInstance;
//     if (dtInstance) {
//       dtInstance.then((api: DataTables.Api) => {
//         const buttons = (api as any).buttons('excelHtml5');
//         if (buttons && buttons.length > 0) {
//           buttons[0].action();
//         }
//       });
//     }
//   }
// }

import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-data-table',
  standalone: true,
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  imports: [CommonModule, TranslateModule, FormsModule]
})
export class DatatableComponent implements OnInit {
  @Input() data: any[] = [];
  @Input() columns: string[] = [];
  @Input() columnTitles: string[] = [];
  @Input() exportLabel: string = 'Exportar';
  @Input() newButtonLabel: string = 'Nueva Aplicación';
  @Input() showActions: boolean = true;
  @Input() idField: string = 'id';
  @Input() showSearchBox: boolean = true;
  @Input() tableTitle: string = '';
  @Input() showNewButton: boolean = false;
  @Input() showViewButton: boolean = false;
  @Input() showEditButton: boolean = false;
  @Input() showDeleteButton: boolean = false;
  @Input() buttonsClass: string = 'btn btn-primary';

  @Output() viewRecord = new EventEmitter<void>();
  @Output() newRecord = new EventEmitter<void>();
  @Output() editRecord = new EventEmitter<any>();
  @Output() deleteRecord = new EventEmitter<any>();

  public filteredData: any[] = [];
  public paginatedData: any[] = [];
  public currentPage: number = 1;
  public itemsPerPage: number = 10;
  public totalPages: number = 1;
  public filterValues: { [key: string]: string } = {};

  public sortByColumn: string | null = null;
  public sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private translateService: TranslateService) {}

  ngOnInit(): void {
    this.applyFiltersAndPagination();
  }

  applyFiltersAndPagination(): void {
    let tempFilteredData = this.data.filter((row) => {
      for (const key of Object.keys(this.filterValues)) {
        const filterValue = this.filterValues[key].toLowerCase();
        const rowValue = String(row[key]).toLowerCase();
        if (filterValue && !rowValue.includes(filterValue)) {
          return false;
        }
      }
      return true;
    });

    if (this.sortByColumn) {
      tempFilteredData = this.sortData(tempFilteredData);
    }

    this.filteredData = tempFilteredData;
    this.totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages > 0 ? this.totalPages : 1;
    }
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedData = this.filteredData.slice(startIndex, startIndex + this.itemsPerPage);
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.applyFiltersAndPagination();
    }
  }

  onItemsPerPageChange(): void {
    this.currentPage = 1;
    this.applyFiltersAndPagination();
  }

  sortData(data: any[]): any[] {
    const column = this.sortByColumn;
    if (!column) {
      return data;
    }

    return [...data].sort((a, b) => {
      const aValue = a[column];
      const bValue = b[column];
      let comparison = 0;

      if (aValue > bValue) {
        comparison = 1;
      } else if (aValue < bValue) {
        comparison = -1;
      }

      return this.sortDirection === 'desc' ? comparison * -1 : comparison;
    });
  }

  onSort(column: string): void {
    if (this.sortByColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortByColumn = column;
      this.sortDirection = 'asc';
    }
    this.applyFiltersAndPagination();
  }

  getPages(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  // Métodos de eventos
  onView(row: any): void {
    this.viewRecord.emit(row[this.idField]);
  }

  onEdit(row: any): void {
    this.editRecord.emit(row[this.idField]);
  }

  onDelete(row: any): void {
    this.deleteRecord.emit({ id: row[this.idField], nombre: row['nombreAplicacion'] });
  }

  onFilter(column: string, event: Event): void {
    const target = event.target as HTMLInputElement;
    this.filterValues[column] = target.value;
    this.currentPage = 1;
    this.applyFiltersAndPagination();
  }

  onNewRecord(): void {
    this.newRecord.emit();
  }

  onExcelExport(): void {
    this.newRecord.emit();
  }
}
