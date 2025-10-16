export interface ColumnMetadata {
  name: string;
  header: string;
  type: 'number' | 'price' | 'text' | 'date' | 'avatar' | 'image' | 'unknown';
  isSortable?: boolean;
}

export type ColumnMetadataType = 'number' | 'price' | 'text' | 'date' | 'avatar' | 'image' | 'unknown';

export interface ColumnMetadata {
  name: string;
  header: string;
  type: 'number' | 'price' | 'text' | 'date' | 'avatar' | 'image' | 'unknown';
  isSortable?: boolean;
}
