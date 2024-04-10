export interface tokenDto {
    jwtToken: string;
    expiration: Date;
    refreshToken: string;
}