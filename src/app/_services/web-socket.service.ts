import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Message } from '../_models/local_message';
import { SocketEvent } from '../_models/event';

import * as socketIo from 'socket.io-client';
import { SharedVariablesService } from '.';
import { Socket } from 'socket.io';

const SERVER_URL = 'http://localhost:3001';

@Injectable()
export class WebSocketService {
  private socket:Socket;
  constructor(private sharedData: SharedVariablesService) {
  }
  public initSocket(fileid): void {
   
    let token = JSON.parse(localStorage.getItem('currentUser')).token;
    this.socket = socketIo(this.sharedData.web_socket_server_url, {
      query: { token: token, design_id: fileid}
    });
    // // console.log(this.socket)
    
  }

  public send(message: Message): void {
    this.socket.emit('message', message);
  }
  public close(): void {
    // this.socket.close()
  }
  public onMessage(): Observable<Message> {
    return new Observable<Message>(observer => {
      this.socket.on('message', (data: Message) => observer.next(data));
    });
  }
  public startSimulation(): void {
    this.socket.emit('start_simulation');
  }
  public stopSimulation(): void {
    this.socket.emit('stop_simulation');
  }
  public onEvent(event: SocketEvent): Observable<any> {
    return new Observable<SocketEvent>(observer => {
      this.socket.on(event, (data) => observer.next(data));
    });
  }
 
}