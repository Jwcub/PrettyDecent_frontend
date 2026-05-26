import { Component, inject, signal } from '@angular/core';
import { MessageService } from '../../services/message.service';
import { Message } from '../../models/message';
import { MessageResponse } from '../../models/message-response';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  imports: [FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {

  apiMessage = signal(""); 
  messageService = inject(MessageService);

  name: string = "";
  email: string = "";
  title: string = "";
  message: string = "";


  sendMessage():void {
    if( this.name === "" || this.email === "" || this.email === "" || this.message === "") {
      this.apiMessage.set("Fill in required fields");
      return;
    }

    const message : Message =  {
      name : this.name,
      email : this.email,
      title : this.title,
      message : this.message
    }

    this.messageService.sendMessage(message).subscribe({
      next: (res: MessageResponse) => this.apiMessage.set(res.message),
      error: (err) => {
        this.apiMessage.set(err.error?.message ?? `Unknown error...`)
      }
    });
  }

}
