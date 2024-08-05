export interface postQuery {
  searchPhrase: string | null;
  pageNumber: number;
  pageSize: number;
  sortBy: string | null;
  sortDirection: number | null;
  postType: string;
  minPrice: number | null;
  maxPrice: number | null;
  minSquare: number | null;
  maxSquare: number | null;
  minSleepingCount: number | null;
  maxSleepingCount: number | null;
  mainCategory: string | null;
  featureFilters: string[] | null;
}
