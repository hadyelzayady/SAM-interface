import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { CanDeactivateComponent } from './can-deactivate.component';

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<CanDeactivateComponent> {
    canDeactivate(component: CanDeactivateComponent): boolean {

        if (!component.canDeactivate()) {
            // console.log("cannot deact")
            if (confirm("You have unsaved changes! If you leave, your changes will be lost.")) {
                return true;
            } else {
                return false;
            }
        }
        // console.log("cannot acti")

        return true;
    }
}
