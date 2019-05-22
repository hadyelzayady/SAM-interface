import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Message } from '../_models/local_message';
import { SocketEvent } from '../_models/event';

import * as socketIo from 'socket.io-client';

const SERVER_URL = 'http://localhost:3001';

@Injectable()
export class WebSocketService {
  private socket;

  public initSocket(data): void {
    let token = JSON.parse(localStorage.getItem('currentUser')).token;
    data["token"] = token
    this.socket = socketIo(SERVER_URL, {
      query: data,
    });
    // // console.log(this.socket)
  }

  public send(message: Message): void {
    this.socket.emit('message', message);
  }
  public close(): void {
    this.socket.close()
    this.socket.r
  }
  public onMessage(): Observable<Message> {
    return new Observable<Message>(observer => {
      this.socket.on('message', (data: Message) => observer.next(data));
    });
  }

  public onEvent(event: SocketEvent): Observable<any> {
    return new Observable<SocketEvent>(observer => {
      this.socket.on(event, (data) => observer.next(data));
    });
  }
}