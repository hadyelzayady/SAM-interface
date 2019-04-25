import { Component, ViewChild, EventEmitter, Output } from '@angular/core';
import { SimCommunicationService } from './_services/sim-communication.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private chatService: SimCommunicationService) {
  }
  ngOnInit() {

  }
}
