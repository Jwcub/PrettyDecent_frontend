import { inject, Injectable, Signal } from '@angular/core';
import { Message } from '../models/message';
import { Observable } from 'rxjs';
import { MessageResponse } from '../models/message-response';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private http = inject(HttpClient);
  url: string = "https://prettydecent-backend.onrender.com/api/message";

  sendMessage(message: Message): Observable<MessageResponse> {
    return this.http.post<Message>(this.url, message);
  }

  // Get messages
  getMessages(): Signal<Message[]> {
    const token = localStorage.getItem("userToken");

    // Create header
    const headers = {
      'Authorization' : `Bearer ${token}`,
    }

    const messages$ = this.http.get<Message[]>(this.url, { headers });
    return toSignal(messages$, { initialValue: []});
  }

  // Update message status
  updateMessageStatus(id: string, message: Message): Observable<MessageResponse> {
    
    const token = localStorage.getItem("userToken");

    // Create header
    const headers = {
      'Authorization' : `Bearer ${token}`,
    }

    return this.http.put<Message>(this.url + "/" + id, message, { headers });
  }

}
