import { inject, Injectable } from '@angular/core';
import { Message } from '../models/message';
import { Observable } from 'rxjs';
import { MessageResponse } from '../models/message-response';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private http = inject(HttpClient);
  url: string = "http://localhost:5500/api/message";

  sendMessage(message: Message): Observable<MessageResponse> {
    return this.http.post<Message>(this.url, message);
  }
}
