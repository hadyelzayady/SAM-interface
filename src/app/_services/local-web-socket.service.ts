
import { Injectable } from '@angular/core';

import { SharedVariablesService } from './shared-variables.service';
import { Message } from '../_models/local_message';
import { SocketEvent } from '../_models/event';
import { PortVisibility } from '@syncfusion/ej2-angular-diagrams';
import { Observable } from 'rxjs';
import * as socketIo from 'socket.io-client';

const SERVER_URL = 'http://localhost:3003';


@Injectable({
  providedIn: 'root'
})
export class LocalWebSocketService {


  constructor(private sharedData: SharedVariablesService) {
  }

  private socket;
  resetBoard(ip: any, port) {
    this.socket.emit('reset', ip, port)
  }
  public initSocket(): void {
    this.socket = socketIo(SERVER_URL);
    // this.webSocket.onEvent(SocketEvent.CONNECTION_ERROR).subscribe(() => {
    //   alert("the local server not running ")
    // })
    // this.webSocket.onMessage().subscribe((msg) => {
    //   let port = this.sharedData.diagram.nodes[this.sharedData.connected_component_id_index[msg.component_id]].ports.find((port) => {
    //     return parseInt(port.id) == msg.port_id;
    //   });
    //   port.visibility = PortVisibility.Visible
    //   port.style = { "fill": "Green" }
    // })
  }

  public send(message: Message): void {
    this.socket.emit('message', message);
  }
  public close(): void {
    this.socket.close()
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