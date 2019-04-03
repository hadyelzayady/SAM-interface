import { Injectable } from '@angular/core';
import { DiagramComponent } from '@syncfusion/ej2-angular-diagrams';
import { FilenameDialogComponent } from '../filename-dialog/filename-dialog.component';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class SharedVariablesService {

  diagram: DiagramComponent;
  dialog: DialogComponent;
  // sim_mode: boolean = false;
  private sim_mode = new BehaviorSubject(false);
  currentMode = this.sim_mode.asObservable();

  changeMode(mode: boolean) {
    this.sim_mode.next(mode)
  }
  baseurl = "http://localhost:3000/api"


}
