import { Injectable } from '@angular/core';
import * as socketIo from 'socket.io-client';
import { SharedVariablesService } from '.';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Observable } from 'rxjs';
import { SocketEvent } from '../_models/event';

const SERVER_URL = 'http://localhost:3001';

@Injectable({
  providedIn: 'root'
})
export class ReserveCommunicationService {

  constructor(private sharedData: SharedVariablesService) {
  }

  private socket;

  public initSocket(fileid): void {
    let token = JSON.parse(localStorage.getItem('currentUser')).token;
    this.socket = socketIo(SERVER_URL, {
      query: { token: token, design_id: fileid, mode: "reserve" }
    });
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
