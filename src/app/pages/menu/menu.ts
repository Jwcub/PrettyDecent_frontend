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
  allMenuItems = signal<MenuItemResponse[]>([]);
  message = signal ("");

  ngOnInit(): void {
    this.menuService.getMenuItems().subscribe(items => {
      this.allMenuItems.set(items);
    });
  }

  appetizers = computed(() => 
    this.allMenuItems().filter(item => item.type === 'food' && item.category === 'appetizer' && item.display === true)
  );

  mainCourses = computed(() => 
    this.allMenuItems().filter(item => item.type === 'food' && item.category === 'main' && item.display === true)
  );

  desserts = computed(() => 
    this.allMenuItems().filter(item => item.type === 'food' && item.category === 'dessert' && item.display === true)
  );

  wines = computed(() => 
    this.allMenuItems().filter(item => item.type === 'drink' && item.category === 'wine' && item.display === true)
  );

  otherDrinks = computed(() => 
    this.allMenuItems().filter(item => item.type === 'drink' && item.category === 'otherdrink' && item.display === true)
  );

}
