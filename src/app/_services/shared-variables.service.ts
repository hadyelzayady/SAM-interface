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
  nodeid_index = {} // settd in simulation button before get_desin_conections
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
    console.log("port value table", this.port_value_table)
    console.log("params", component_index, port_id, value)
    if (component_index in this.port_value_table && port_id in this.port_value_table[component_index])
      this.port_value_table[component_index][port_id].next(value)
  }

  addOutputEvent(port_id, component_index): Observable<boolean> {
    if (!(component_index in this.port_value_table)) {
      this.port_value_table[component_index] = {}
      this.port_observables_table[component_index] = {}

    }
    console.log("add output:", this.port_value_table[component_index])
    this.port_value_table[component_index][port_id] = new BehaviorSubject(false)
    this.port_observables_table[component_index][port_id] = this.port_value_table[component_index][port_id].asObservable();
    return this.port_observables_table[component_index][port_id];

  }
  //////////////////
  domainbaseurl = "http://192.168.1.113:3000/"
  baseurl = `${this.domainbaseurl}api`
  imageUrl = `${this.domainbaseurl}component/`



}
