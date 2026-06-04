import { Component, inject, signal } from '@angular/core';
import { BookingService } from '../../services/booking.service';
import { ReservationResponse } from '../../models/reservation-response';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-booking',
  imports: [FormsModule],
  templateUrl: './booking.html',
  styleUrl: './booking.css',
})
export class Booking {
  bookingService = inject(BookingService);
  message = signal("");

  dateInput: string = "";
  timeInput: string = "";

  newBooking = {
    name: "",
    phone: "",
    date: "",
    guests:  0,
    requests: ""
  }

  bookTable():void {
    if (!this.dateInput || !this.timeInput) {
      this.message.set("Ange datum och/eller tid")
      return;
    }

    // Convert local time to UTC
    const dateTimeString = `${this.dateInput}T${this.timeInput}`;
    this.newBooking.date = dateTimeString;

    this.bookingService.makeReservation(this.newBooking).subscribe({
      next: (res: ReservationResponse) => {
        this.message.set("Bord reserverat"),
        this.newBooking.name = "";
        this.newBooking.phone = "";
        this.newBooking.date = "";
        this.newBooking.guests = 0;
        this.newBooking.requests = "";
      },
      error: (err) => {
        this.message.set(err.error?.message ?? `Okänt fel`)
      }
    });
  }
}
