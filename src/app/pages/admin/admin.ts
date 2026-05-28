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

  // Function for displaying time, time shows in: YYYY-MM-DD, (hh:mm)
displayDate(dateObject?: Date): string {
  if (!dateObject) return "Couldn't read time";
  const d = new Date(dateObject);
  const date = d.toLocaleDateString("sv-SE");
  const time = d.toLocaleTimeString("sv-SE", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return time === "00:00" ? date : `${date}, ${time}`;
}

  
  /*
  ** TABLE RESERVATIONS
  */

  // Inject booking-service and get reservations
  bookingService = inject(BookingService);
  reservations = this.bookingService.getReservations();

  // Convert time to local time string
  toDatetimeLocal(dateObject: Date) {
    const date = new Date(dateObject);
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

  // Hide reservations that have past and sort by time of reservation
  currentReservations = computed(() => {
    const today = new Date();

    today.setHours(0, 0, 0, 0);
    return this.reservations().filter(
      res => new Date(res.date) > today
    ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
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
        this.errorMessage.set("Reservation has been updated");
        this.editingId = null;
        console.log('Uppdaterad:', res);
      },
      error: (err: any) => {
        this.errorMessage.set(err.error?.message ?? `Could not update reservation ${err.message}`);
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

  // Change status on message (PUT)
  changeStatus(message: Message): void {
    if (!message._id) {
      console.error("Could not update message status.");
      this.errorMessage.set("Could not update message status.");
      return; 
    }

    this.messageService.updateMessageStatus(message._id, message).subscribe({
      next: (res: any) => {
        this.errorMessage.set("Message status has been changed");
      },
      error: (err: any) => {
        this.errorMessage.set(err.error?.message ?? `Could not update menu item ${err.message}`);
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
        this.errorMessage.set("New menu item submited to menu");
        this.newMenuItem.name = "";
        this.newMenuItem.description = "";
        this.newMenuItem.type = null;
        this.newMenuItem.category = "";
        this.newMenuItem.price = 0;
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message ?? `Unknown error occured`)
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
        this.errorMessage.set("Menu item has been updated");
        this.editingId = null;
      },
      error: (err: any) => {
        this.errorMessage.set(err.error?.message ?? `Could not update menu item ${err.message}`);
      }
    });
  }

  // Remove menu item
  removeItem(item: MenuItemResponse): void {
    this.menuService.removeMenuItem(item._id).subscribe({
      next: (res: any) => {
        this.menuItems.update(items => items.filter(i => i._id !== item._id));
        this.errorMessage.set("Menu item has been removed");

      },
      error: (err: any) => {
        this.errorMessage.set(err.error?.message ?? `Something went wrong, menu item wasn't removed`);
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
