import { userDto } from "./userDto";


export interface commentDto {
    commentText: string;
    commentTime: Date;
    user: userDto;
}