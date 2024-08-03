import { commentDto } from './commentDto';
import { userDto } from './userDto';

export interface forRentPostDto {
  postId: number;
  title: string;
  description: string;
  mainCategory: string;
  squareFootage: number;
  sleepingPlaceCount: number;
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
  features: string[];
  comments: commentDto[];
  rate: number;
  isFollowedByUser: boolean | null;
  user: userDto;
  confirmed: boolean;
}
