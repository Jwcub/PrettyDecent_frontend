import { inject, Injectable } from '@angular/core';
import { ReservationResponse } from '../models/reservation-response';
import { Observable } from 'rxjs';
import { Reservation } from '../models/reservation';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class BookingService {

  private http = inject(HttpClient);
  url: string = "http://localhost:5500/api/reservation";

  makeReservation(reservation: Reservation): Observable<ReservationResponse> {
    const token = localStorage.getItem("userToken");

    // Create header
    const headers = {
      'Authorization' : `Bearer ${token}`,
    }

    return this.http.post<ReservationResponse>(this.url, reservation, { headers });
  }
}
