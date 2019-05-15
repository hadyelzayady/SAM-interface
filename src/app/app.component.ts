import { Component, ViewChild, EventEmitter, Output } from '@angular/core';
import { SimCommunicationService } from './_services/sim-communication.service';
import { RoutingStateService } from './_services/routing-state.service';
import { Router, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Event as NavigationEvent } from "@angular/router";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private chatService: SimCommunicationService, routingState: RoutingStateService, route: Router) {
    route.events
      .pipe(
        // The "events" stream contains all the navigation events. For this demo,
        // though, we only care about the NavigationStart event as it contains
        // information about what initiated the navigation sequence.
        filter(
          (event: NavigationEvent) => {

            return (event instanceof NavigationStart);

          }
        )
      )
      .subscribe(
        (event: NavigationStart) => {
          console.group("NavigationStart Event");
          // Every navigation sequence is given a unique ID. Even "popstate"
          // navigations are really just "roll forward" navigations that get
          // a new, unique ID.
          console.log("navigation id:", event.id);
          console.log("route:", event.url);
          // The "navigationTrigger" will be one of:
          // --
          // - imperative (ie, user clicked a link).
          // - popstate (ie, browser controlled change such as Back button).
          // - hashchange
          // --
          // NOTE: I am not sure what triggers the "hashchange" type.
          console.log("trigger:", event.navigationTrigger);
        }
      )
  }
  ngOnInit() {

  }
}
