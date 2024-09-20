export interface reservationDto {
  reservationId: number;
  userId: number;
  postId: number;
  fromDate: Date;
  toDate: Date;
  reservationFlag: ReservationFlagEnum;
}

export enum ReservationFlagEnum {
  'Created' = 0,
  'Confirmed' = 1,
  'Cancelled' = 2,
  'Completed' = 3,
}
