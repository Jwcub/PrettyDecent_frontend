import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { MenuItem } from '../models/menu';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { MenuItemResponse } from '../models/menu-response';
import { RemoveResponse } from '../models/remove-response';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private http = inject(HttpClient);
  url: string = "http://localhost:5500/api/menu";

  // Get menu items
 getMenuItems(): Observable<MenuItemResponse[]> {
  return this.http.get<MenuItemResponse[]>(this.url);
}

  // Add new menu item
  addMenuItem(menuItem: MenuItem): Observable<MenuItemResponse> {
    const token = localStorage.getItem("userToken");

    // Create header
    const headers = {
      'Authorization' : `Bearer ${token}`,
    }

    return this.http.post<MenuItemResponse>(this.url, menuItem, { headers });
  }

  // Edit menu item
  editMenuItem(id: string, menuItem: MenuItemResponse): Observable<MenuItemResponse> {
    const token = localStorage.getItem("userToken");

    // Create header
    const headers = {
      'Authorization' : `Bearer ${token}`,
    }

    return this.http.put<MenuItemResponse>(this.url + "/" + id, menuItem, { headers });
  }

  // Remove menu item
  removeMenuItem(id: string) {
    const token = localStorage.getItem("userToken");

    // Create header
    const headers = {
      'Authorization' : `Bearer ${token}`,
    }

    return this.http.delete<RemoveResponse>(this.url + "/" + id, { headers });  
  }
}
