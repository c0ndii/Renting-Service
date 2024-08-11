export interface postQueryMap {
  searchPhrase: string | null;
  postType: string;
  minPrice: number | null;
  maxPrice: number | null;
  minSquare: number | null;
  maxSquare: number | null;
  minSleepingCount: number | null;
  maxSleepingCount: number | null;
  mainCategory: string | null;
  featureFilters: string[] | null;
  northEastLat: string;
  northEastLng: string;
  southWestLat: string;
  southWestLng: string;
}
