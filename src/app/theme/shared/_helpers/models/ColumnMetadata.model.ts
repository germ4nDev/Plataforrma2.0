export interface ColumnMetadata {
  name: string;
  header: string;
  type: 'number' | 'price' | 'text' | 'date' | 'avatar' | 'image' | 'array_text' | 'array_tags' | 'unknown';
  isSortable?: boolean;
}

export type ColumnMetadataType = 'number' | 'price' | 'text' | 'date' | 'avatar' | 'image' | 'array_text' | 'array_tags' | 'unknown';

export interface ColumnMetadata {
  name: string;
  header: string;
  type: 'number' | 'price' | 'text' | 'date' | 'avatar' | 'image' | 'array_text' | 'array_tags' | 'unknown';
  isSortable?: boolean;
}
