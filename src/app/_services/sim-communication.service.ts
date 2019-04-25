import { Injectable } from '@angular/core';

import { WebSocketService } from './web-socket.service';
import { SharedVariablesService } from './shared-variables.service';
import { Message } from '../_models/local_message';
import { SocketEvent } from '../_models/event';
import { PortVisibility } from '@syncfusion/ej2-angular-diagrams';
@Injectable({
  providedIn: 'root'
})
export class SimCommunicationService {
  private url = 'http://localhost:3001';
  private socket;
  m
  constructor(private webSocket: WebSocketService, private sharedData: SharedVariablesService) {
  }


  initConnection() {
    this.webSocket.initSocket()


    this.webSocket.onEvent(SocketEvent.CONNECT).subscribe(() => {
      console.log("connected")
    })

    this.webSocket.onEvent(SocketEvent.DISCONNECT).subscribe(() => {
      console.log("disconnected")
    })
    this.webSocket.onEvent(SocketEvent.CONNECTION_ERROR).subscribe(() => {
      alert("the local server not running ")
    })
    this.webSocket.onMessage().subscribe((msg) => {
      let port = this.sharedData.diagram.nodes[this.sharedData.connected_component_id_index[msg.component_id]].ports.find((port) => {
        return parseInt(port.id) == msg.port_id;
      });
      console.log(port.style)
      port.visibility = PortVisibility.Visible
      port.style = { "fill": "Green" }
    })
  }
  sendMsg(msg) {
    this.webSocket.send(msg)
  }

  closeConnection() {
    this.webSocket.close()
    this.socket.removeAllListeners();
  }



}
