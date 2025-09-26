/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import * as XLSX from 'xlsx';

// Añade OnChanges y SimpleChanges a las importaciones
import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-data-table',
  standalone: true,
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  imports: [CommonModule, TranslateModule, FormsModule]
})
// Añade 'implements OnChanges' a la declaración de la clase
export class DatatableComponent implements OnInit, OnChanges {
  @Input() data: any[] = [];
  @Input() columns: string[] = [];
  @Input() detailColumns: string[] = [];
  @Input() columnTitles: string[] = [];
  @Input() detailTitles: string[] = [];
  @Input() exportLabel: string = 'Exportar';
  @Input() newButtonLabel: string = 'Nueva Aplicación';
  @Input() showAvatar: boolean = false;
  @Input() showActions: boolean = true;
  @Input() idField: string = 'id';
  @Input() showSearchBox: boolean = true;
  @Input() tableTitle: string = '';
  @Input() showNewButton: boolean = false;
  @Input() showViewButton: boolean = false;
  @Input() showEditButton: boolean = false;
  @Input() showDeleteButton: boolean = false;
  @Input() showDetail: boolean = false;
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
  public registroId: number = 0;

  constructor() {}

  ngOnInit(): void {
    console.log('entrar aqui', this.data);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.currentPage = 1;
      this.applyFiltersAndPagination();
    }
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

  onView(row: any): void {
    this.viewRecord.emit(row[this.idField]);
  }

  onEdit(row: any): void {
    this.editRecord.emit(row[this.idField]);
  }

  onDelete(row: any): void {
    this.deleteRecord.emit({ id: row[this.idField] });
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
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.filteredData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, this.tableTitle);
    const hoy = new Date();
    const timestamp = hoy.getTime();
    const bookName = this.tableTitle + '_' + timestamp + '.xlsx';
    XLSX.writeFile(wb, bookName);
  }

  toggleDetails(row: any): void {
    this.registroId = this.registroId === row[this.idField] ? null : row[this.idField];
  }

  emptyMethod() {
    console.log('Metodo vacio');
  }
}
