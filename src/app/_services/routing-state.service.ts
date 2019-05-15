import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RoutingStateService {

  private history = [];

  constructor(
    private router: Router
  ) { }

  public loadRouting(): void {
    alert("rerouting")
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(({ urlAfterRedirects }: NavigationEnd) => {
        this.history = [...this.history, urlAfterRedirects];
      });
  }

  public getHistory(): string[] {
    console.log()
    return this.history;
  }

  public getPreviousUrl(): string {
    alert(`get previuous route: ${this.history}`)
    return this.history[this.history.length - 2] || '/index';
  }
}
