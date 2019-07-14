import { Injectable } from '@angular/core';

import { WebSocketService } from './web-socket.service';
import { SharedVariablesService } from './shared-variables.service';
import { Message } from '../_models/local_message';
import { SocketEvent } from '../_models/event';
import { PortVisibility } from '@syncfusion/ej2-angular-diagrams';
import { Observable } from 'rxjs';
import * as socketIo from 'socket.io-client';


@Injectable({
  providedIn: 'root'
})
export class SimCommunicationService {
  constructor(private sharedData: SharedVariablesService) {
  }

  private socket;

  public initSocket(fileid, mode = "simulate"): void {
    let token = JSON.parse(localStorage.getItem('currentUser')).token;
    this.socket = socketIo(this.sharedData.web_socket_server_url, {
      query: { token: token, design_id: fileid, mode: mode }
    });
    console.log("listeners: ", this.socket.listenerCount);
    // // console.log(this.socket)
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
  public bindBoards(design_id: number): void {
    this.socket.emit('bind_boards', design_id);
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
