import { commentDto } from './commentDto';
import { userDto } from './userDto';

export interface postDto {
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
  confirmed: boolean;
  sleepingPlaceCount: number | null;
  features: string[];
  comments: commentDto[];
  rate: number | null;
}
