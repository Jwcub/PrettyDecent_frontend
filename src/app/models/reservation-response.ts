import { Reservation } from "./reservation";

export type ReservationStatus = 'newBooking' | 'confirmed' | 'cancelled';

export interface ReservationResponse extends Reservation{
    _id: string;
    status: ReservationStatus;
    created: Date;
    __v: 0;
}
