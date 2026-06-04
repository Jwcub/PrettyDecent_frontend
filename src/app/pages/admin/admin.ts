import { Component, computed, effect, inject, signal, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import { RegisterResponse } from '../../models/register-response';
import { MenuService } from '../../services/menu.service';
import { MenuItem, MenuItemType } from '../../models/menu';
import { MenuItemResponse } from '../../models/menu-response';
import { BookingService } from '../../services/booking.service';
import { ReservationResponse } from '../../models/reservation-response';
import { MessageService } from '../../services/message.service';
import { Message } from '../../models/message';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-admin',
  imports: [FormsModule, NgClass],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {
  // Editing id for triggering edit-field
  editingId: string | null = null;

  // Feedback and error-messages handling
  errorMessage = signal("");

  constructor() {
    effect(() => {
      const message = this.errorMessage();
    
      if (message) {
        setTimeout(() => {
          this.errorMessage.set("");
        }, 5000);
      }
    });
  }
  
  /*
  ** TABLE RESERVATIONS
  */

  // Inject booking-service and get reservations
  bookingService = inject(BookingService);
  reservations = this.bookingService.getReservations();

// Function to display time in format ("2026-06-04, 13:37")
  displayDateTime(isoString: string): string {
    if (!isoString) return '';

    const datePart = isoString.slice(0, 10);
    const timePart = isoString.slice(11, 16);

    return `${datePart}, ${timePart}`;
  }

  formatForInput(isoString: string): string {
    if (!isoString) return '';
    return isoString.slice(0, 16); 
  }

  // Hide reservations that have past and sort by time (soon ->)
  currentReservations = computed(() => {
    const today = new Date();

    today.setHours(0, 0, 0, 0);
    return this.reservations().filter(res => {
      if (!res.date) return false;

      new Date(res.date) > today
      return new Date(res.date) >= today;

    }).sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
});

  // Edit Reservation
  editingReservation: ReservationResponse | null = null; 
  
  editReservation(reservation: ReservationResponse): void {
    this.editingId = reservation._id;
    this.editingReservation = { ...reservation }; 
  }
  
  // Update reservation
  saveUpdatedReservation(reservation: ReservationResponse): void {
    this.bookingService.editReservation(reservation._id, reservation).subscribe({
      next: (res: any) => {
        this.errorMessage.set("Reservationen har uppdaterats");
        this.editingId = null;
        console.log('Uppdaterad:', res);
      },
      error: (err: any) => {
        this.errorMessage.set(err.error?.message ?? `Kunde inte uppdaterad reservationen ${err.message}`);
      }
    });
  }

  // Cancel editing reservation
  cancelEdit(): void {
  this.editingId = null;
  }


  /*
  ** MESSAGES
  */

  // Inject message-service and get messages
  messageService = inject(MessageService);
  messages = this.messageService.getMessages();

  // Turn timestamp to localtime string
  displayTimestamp(date: Date | undefined): string {
    if(!date) return ''; 
    const dateString = date.toString();
    const dateOutput = dateString.slice(0, 10);
    const timeOutput = dateString.slice(11, 16);

    return `${dateOutput}, ${timeOutput}`;
  }

  // Change status on message (PUT)
  changeStatus(message: Message): void {
    if (!message._id) {
      console.error("Kunde inte uppdatera meddelandet.");
      this.errorMessage.set("Kunde inte uppdatera meddelandet.");
      return; 
    }

    this.messageService.updateMessageStatus(message._id, message).subscribe({
      next: (res: any) => {
        this.errorMessage.set("Status för meddelande har ändras");
      },
      error: (err: any) => {
        this.errorMessage.set(err.error?.message ?? `Kunde ändra meddelandet ${err.message}`);
      }
    });
  }


  /* 
  ** MENU SERVICES **
  */

  // Inject menu-service create signal for Menu item
  menuService = inject(MenuService)
  menuItems = signal<MenuItemResponse[]>([]);

  // Load menu items upon pageload, this because we want to be able to update menu item using ".update".
  ngOnInit(): void {
    this.menuService.getMenuItems().subscribe(items => {
      this.menuItems.set(items);
    });
  }

  // Add a new menu item
  newMenuItem: MenuItem = {
    name: "",
    description: "",
    type: null,
    category: "",
    price: 0
  };
  
  addMenuItem(): void {
    this.menuService.addMenuItem(this.newMenuItem).subscribe({
      next: (res: MenuItemResponse) => {
        this.menuItems.update(currentMenuItems => [...currentMenuItems, res]);
        this.errorMessage.set("Ny maträtt/dryck tillaggd i menyn");
        this.newMenuItem.name = "";
        this.newMenuItem.description = "";
        this.newMenuItem.type = null;
        this.newMenuItem.category = "";
        this.newMenuItem.price = 0;
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message ?? `Okänt fel inträffade`)
      }
    });
  };

  // Edit reservation
  editingMenuItem: MenuItemResponse | null = null; 

  startEdit(item: MenuItemResponse): void {
    this.editingId = item._id;
    this.editingMenuItem = { ...item }; 
  }
  
  // Save edited menuItem (PUT)
  saveEdit(menuItem: MenuItemResponse): void {
    this.menuService.editMenuItem(menuItem._id, menuItem).subscribe({
      next: (res: any) => {
        this.errorMessage.set("Menyn uppdaterad");
        this.editingId = null;
      },
      error: (err: any) => {
        this.errorMessage.set(err.error?.message ?? `Kunde inte uppdatera menyn ${err.message}`);
      }
    });
  }

  // Remove menu item
  removeItem(item: MenuItemResponse): void {
    this.menuService.removeMenuItem(item._id).subscribe({
      next: (res: any) => {
        this.menuItems.update(items => items.filter(i => i._id !== item._id));
        this.errorMessage.set("Mat/dryck har raderats");

      },
      error: (err: any) => {
        this.errorMessage.set(err.error?.message ?? `Något gick fel, menyartikel kunde inte raderas`);
      }
    });
  }

  /*
  ** ADD NEW USER
  */

  authService = inject(AuthService);

  newUser: User = {
    email: "",
    password: ""
  }

  register():void {
    const user: User = {
      email: this.newUser.email,
      password: this.newUser.password
    }

    this.authService.register(user).subscribe({
      next: (res: RegisterResponse) => {
        this.newUser.email = "";
        this.newUser.password = "";
        this.errorMessage.set(res.message);
      }, 
      error: (err) => this.errorMessage.set(err.error.error)
    });
  }
}
