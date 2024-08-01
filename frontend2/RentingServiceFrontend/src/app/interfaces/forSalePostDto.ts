import { userDto } from './userDto';

export interface forSalePostDto {
  postId: number;
  title: string;
  description: string;
  mainCategory: string;
  squareFootage: number;
  price: number;
  picturesPath: string;
  pictures: string[];
  lat: string;
  lng: string;
  buildingNumber: string;
  street: string;
  district: string;
  city: string;
  country: string;
  addDate: Date;
  followCount: number;
  isFollowedByUser: boolean | null;
  user: userDto;
}
