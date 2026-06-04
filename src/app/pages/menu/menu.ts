import { Component, computed, inject, signal } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { MenuItemResponse } from '../../models/menu-response';

@Component({
  selector: 'app-menu',
  imports: [],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {
  menuService = inject(MenuService)

  //Signals
  allMenuItems = signal<MenuItemResponse[]>([]);
  message = signal<string>("");
  isLoading = signal<boolean>(true);

  ngOnInit(): void {
    this.menuService.getMenuItems().subscribe({
      next: (items) => {
        this.allMenuItems.set(items);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      }
    })
  }

  // Filter to show only appetizers
  appetizers = computed(() => 
    this.allMenuItems().filter(item => item.type === 'food' && item.category === 'appetizer' && item.display === true)
  );

  // Filter to show only main courses
  mainCourses = computed(() => 
    this.allMenuItems().filter(item => item.type === 'food' && item.category === 'main' && item.display === true)
  );

  // Filter to show only desserts
  desserts = computed(() => 
    this.allMenuItems().filter(item => item.type === 'food' && item.category === 'dessert' && item.display === true)
  );

  // Filter to show only wine
  wines = computed(() => 
    this.allMenuItems().filter(item => item.type === 'drink' && item.category === 'wine' && item.display === true)
  );

  // Filter to show only all drinks exept wine
  otherDrinks = computed(() => 
    this.allMenuItems().filter(item => item.type === 'drink' && item.category === 'otherdrink' && item.display === true)
  );

}
