export interface ColumnMetadata {
  name: string;
  header: string;
  type:
    | 'number'
    | 'price'
    | 'date'
    | 'avatar'
    | 'image'
    | 'video'
    | 'capture'
    | 'color_chip'
    | 'text'
    | 'estado'
    | 'array_text'
    | 'array_tags'
    | 'unknown';
  isSortable?: boolean;
}

export type ColumnMetadataType =
  | 'number'
  | 'price'
  | 'date'
  | 'avatar'
  | 'image'
  | 'video'
  | 'capture'
  | 'color_chip'
  | 'text'
  | 'estado'
  | 'array_text'
  | 'array_tags'
  | 'unknown';

export interface ColumnMetadata {
  name: string;
  header: string;
  type:
    | 'number'
    | 'price'
    | 'date'
    | 'avatar'
    | 'image'
    | 'video'
    | 'capture'
    | 'color_chip'
    | 'text'
    | 'estado'
    | 'array_text'
    | 'array_tags'
    | 'unknown';
  isSortable?: boolean;
}
