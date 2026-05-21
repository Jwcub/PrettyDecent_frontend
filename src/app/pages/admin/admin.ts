import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import { RegisterResponse } from '../../models/register-response';

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
      error: (err) => this.message.set(err.error.message)
    });
  }

}
