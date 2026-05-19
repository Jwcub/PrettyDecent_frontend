import { Routes } from '@angular/router';
import { Homepage } from './pages/homepage/homepage';
import { Menu } from './pages/menu/menu';
import { About } from './pages/about/about';
import { Contact } from './pages/contact/contact';
import { Booking } from './pages/booking/booking';
import { Login } from './pages/login/login';
import { Admin } from './pages/admin/admin';
import { NotFound } from './pages/not-found/not-found';

export const routes: Routes = [
    { path: "homepage", component: Homepage},
    { path: "menu", component: Menu },
    { path: "about", component: About },
    { path: "contact", component: Contact },
    { path: "booking", component: Booking },
    { path: "login", component: Login },
    { path: "admin", component: Admin },
    { path: "", redirectTo: "homepage", pathMatch: "full" },
    { path: "404", component: NotFound },
    { path: "**", redirectTo: "404", pathMatch: "full" }
];
