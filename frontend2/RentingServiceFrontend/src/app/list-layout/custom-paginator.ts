import { MatPaginatorIntl } from '@angular/material/paginator';

export function CustomPaginator() {
  const customPaginatorIntl = new MatPaginatorIntl();

  customPaginatorIntl.nextPageLabel = 'Następna';
  customPaginatorIntl.previousPageLabel = 'Poprzednia';
  customPaginatorIntl.itemsPerPageLabel = 'Ilość ogłoszeń na stronę:';
  customPaginatorIntl.getRangeLabel = (
    page: number,
    pageSize: number,
    length: number
  ) => {
    if (length === 0 || pageSize === 0) {
      return `Brak ogłoszeń`;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex =
      startIndex < length
        ? Math.min(startIndex + pageSize, length)
        : startIndex + pageSize;
    return `${startIndex + 1} - ${endIndex} na ${length}`;
  };
  return customPaginatorIntl;
}
