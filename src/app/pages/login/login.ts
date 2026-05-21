import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private router = inject(Router);

  email: string = "";
  password: string = "";

  message = signal("");
  authService = inject(AuthService)

  //Login function
  login():void {
    const user: User = {
      email: this.email,
      password: this.password
    }

    if(!this.email || !this.password){
      this.message.set("Please fill in email and password");
      return
    }
    
    console.log(user);

    this.authService.login(user).subscribe({
      next: () => {
        this.router.navigate(['/admin'])
      },
      error: () => this.message.set("Incorrect user credetials")
    })
  }
  

}
