import { Injectable } from '@angular/core';
import { DiagramComponent } from '@syncfusion/ej2-angular-diagrams';
import { FilenameDialogComponent } from '../filename-dialog/filename-dialog.component';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { BehaviorSubject, Observable, Subject } from 'rxjs';


@Injectable()
export class SharedVariablesService {

  diagram: DiagramComponent;
  dialog: DialogComponent;
  connected_component_id_index = {};
  componentid_index = {}
  // sim_mode: boolean = false;
  /////////////
  //called when design component is destroyed so every subscriber subscribes from it
  public unsubscribe_sim: Subject<void> = new Subject();

  private sim_mode = new BehaviorSubject(false);
  currentMode = this.sim_mode.asObservable();
  changeMode(mode: boolean) {
    this.sim_mode.next(mode)
  }
  /////////////
  ////////////////
  port_value_table: { [k: string]: { [k2: string]: BehaviorSubject<boolean> } } = {};
  port_observables_table: { [k: string]: any } = {}

  changePortValue(value: boolean, port_id, component_index) {
    this.port_value_table[component_index][port_id].next(value)
  }

  addOutputEvent(port_id, component_index): Observable<boolean> {
    this.port_value_table[component_index] = { [port_id]: new BehaviorSubject(false) }
    this.port_observables_table[component_index] = { [port_id]: this.port_value_table[component_index][port_id].asObservable() };
    console.log("added output", this.port_value_table)
    return this.port_observables_table[component_index][port_id];

  }
  //////////////////
  baseurl = "http://localhost:3000/api"


}
