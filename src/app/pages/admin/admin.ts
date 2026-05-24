import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import { RegisterResponse } from '../../models/register-response';
import { MenuService } from '../../services/menu.service';
import { MenuItem, MenuItemType } from '../../models/menu';
import { MenuItemResponse } from '../../models/menu-response';

@Component({
  selector: 'app-admin',
  imports: [FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {

  // Menu services
  menuMessage = signal("");
  addMenuMessage = signal("");
  menuService = inject(MenuService)
  menuItems = this.menuService.getMenuItems();

  // Add new menu item
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
        this.addMenuMessage.set("New menu item submited to menu");
        this.newMenuItem.name = "";
        this.newMenuItem.description = "";
        this.newMenuItem.type = null;
        this.newMenuItem.category = "";
        this.newMenuItem.price = 0;
      },
      error: (err) => {
        this.addMenuMessage.set(err.error?.message ?? `Ett okänt fel uppstod...`)
      }
    });
  };

  // Allow editing of menu items
  editingId: string | null = null;
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

  cancelEdit(): void {
  this.editingId = null;
  }

  // Add new user account
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
