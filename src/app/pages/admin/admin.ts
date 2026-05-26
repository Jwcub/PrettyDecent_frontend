import { Component, computed, inject, signal, Signal } from '@angular/core';
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

@Component({
  selector: 'app-admin',
  imports: [FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {
  editingId: string | null = null;

  /*
  ** TABLE RESERVATIONS
  */
  reservationMessage = signal("");
  bookingService = inject(BookingService);
  reservations = this.bookingService.getReservations();

  // Hide reservations that have past
  currentReservations = computed(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.reservations().filter(
      res => new Date(res.date) > today
    );
  });

  // Show time in format YYYY-MM-DD, hh:mm
  displayDate(dateObject: Date | undefined): string {
    if (!dateObject) return "Couldn't read time";
    const d = new Date(dateObject);
    const offset = d.getTimezoneOffset() * 60000;
    const dateTime = new Date(d.getTime() - offset).toISOString();
    const date = dateTime.slice(0, 10);
    const time = dateTime.slice(11, 16);
    return time === "00:00" ? date : `${date}, ${time}`;
  }

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
        this.reservationMessage.set("Reservation has been updated");
        this.editingId = null;
        console.log('Uppdaterad:', res);
      },
      error: (err: any) => {
        this.reservationMessage.set(err.error?.message ?? `Could not update reservation ${err.message}`);
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
  messageService = inject(MessageService);
  messages = this.messageService.getMessages();

  /* 
  ** MENU SERVICES **
  */
  menuMessage = signal("");
  addMenuMessage = signal("");
  menuService = inject(MenuService)
  menuItems = signal<MenuItemResponse[]>([]);

  // Load menu items upon pageload
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
        this.addMenuMessage.set("New menu item submited to menu");
        this.newMenuItem.name = "";
        this.newMenuItem.description = "";
        this.newMenuItem.type = null;
        this.newMenuItem.category = "";
        this.newMenuItem.price = 0;
      },
      error: (err) => {
        this.addMenuMessage.set(err.error?.message ?? `Unknown error occured`)
      }
    });
  };

  // Edit reservation
  editingMenuItem: MenuItemResponse | null = null; 

  startEdit(item: MenuItemResponse): void {
    this.editingId = item._id;
    this.editingMenuItem = { ...item }; 
  }
  
  saveEdit(menuItem: MenuItemResponse): void {
    this.menuService.editMenuItem(menuItem._id, menuItem).subscribe({
      next: (res: any) => {
        this.menuMessage.set("Menu item has been updated");
        this.editingId = null;
      },
      error: (err: any) => {
        this.menuMessage.set(err.error?.message ?? `Could not update menu item ${err.message}`);
      }
    });
  }

  // Remove menu item
  removeItem(item: MenuItemResponse): void {
    this.menuService.removeMenuItem(item._id).subscribe({
      next: (res: any) => {
        this.menuItems.update(items => items.filter(i => i._id !== item._id));
        this.menuMessage.set("Menu item has been removed");

      },
      error: (err: any) => {
        this.menuMessage.set(err.error?.message ?? `Something went wrong, menu item wasn't removed`);
      }
    });
  }

  /*
  ** ADD NEW USER
  */

  userMessage = signal("");
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
        this.userMessage.set(res.message);
      }, 
      error: (err) => this.userMessage.set(err.error.error)
    });
  }
}
