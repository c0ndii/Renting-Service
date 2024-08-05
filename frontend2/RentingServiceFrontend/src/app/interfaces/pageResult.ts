import { postDto } from './postDto';

export interface pageResult {
  items: postDto[];
  totalPages: number;
  itemFrom: number;
  itemTo: number;
  totalItemsCount: number;
}
