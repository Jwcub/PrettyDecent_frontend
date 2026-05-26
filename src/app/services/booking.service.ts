import { inject, Injectable, Signal } from '@angular/core';
import { ReservationResponse } from '../models/reservation-response';
import { Observable } from 'rxjs';
import { Reservation } from '../models/reservation';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class BookingService {

  private http = inject(HttpClient);
  url: string = "http://localhost:5500/api/reservation";

    // Get menu items
   getReservations(): Signal<ReservationResponse[]> {
    const token = localStorage.getItem("userToken");

    // Create header
    const headers = {
      'Authorization' : `Bearer ${token}`,
    }

    const reservations$ = this.http.get<ReservationResponse[]>(this.url, { headers });
    return toSignal(reservations$, { initialValue: []});
  }

  makeReservation(reservation: Reservation): Observable<ReservationResponse> {
    const token = localStorage.getItem("userToken");

    // Create header
    const headers = {
      'Authorization' : `Bearer ${token}`,
    }

    return this.http.post<ReservationResponse>(this.url, reservation, { headers });
  }

    editReservation(id: string, reservation: ReservationResponse): Observable<ReservationResponse> {
      const token = localStorage.getItem("userToken");
  
      // Create header
      const headers = {
        'Authorization' : `Bearer ${token}`,
      }
  
      return this.http.put<ReservationResponse>(this.url + "/" + id, reservation, { headers });
    }

}
