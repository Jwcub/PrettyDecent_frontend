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

  email: string = "";
  password: string = "";

  message = signal("");
  authService = inject(AuthService)

  register():void {
    const user: User = {
      email: this.email,
      password: this.password
    }

    this.authService.register(user).subscribe({
      next: (res: RegisterResponse) => {
        this.email = "";
        this.password = "";
        this.message.set(res.message);
      }, 
      error: (err) => this.message.set(err.error.error)
    });
  }

  menuMessage = signal("");
  menuService = inject(MenuService)
  menuItems = this.menuService.getMenuItems();
  editingId: string | null = null;

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
        this.menuMessage.set("New menu item submited to menu");
        this.newMenuItem.name = "";
        this.newMenuItem.description = "";
        this.newMenuItem.type = null;
        this.newMenuItem.category = "";
        this.newMenuItem.price = 0;
      },
      error: (err) => {
        this.menuMessage.set(err.error?.message ?? `Ett okänt fel uppstod...`)
      }
    });
  };

  startEdit(id: string) {
    this.editingId = id;
  }
  
  saveEdit(menuItem: MenuItemResponse): void {
    this.menuService.editMenuItem(menuItem._id, menuItem).subscribe({
      next: (res: any) => {
        this.menuMessage.set("Menu item has been updated");
        this.editingId = null;
      },
      error: (err: any) => {
        this.menuMessage.set(err.error?.message ?? `Could not update menu item`);
      }
    });
  }

  cancelEdit(): void {
  this.editingId = null;
  }

}
