import { postDto } from './postDto';
import { userDto } from './userDto';

export interface commentDto {
  commentId: number;
  commentText: string;
  commentTime: Date;
  user: userDto;
  forRentPost: postDto;
}
