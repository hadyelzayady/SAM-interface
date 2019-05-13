import { Injectable } from '@angular/core';
import { DiagramComponent } from '@syncfusion/ej2-angular-diagrams';
import { FilenameDialogComponent } from '../filename-dialog/filename-dialog.component';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { OutputEvent } from '../_models';
import { addInfo_simValue } from '../utils';


@Injectable()
export class SharedVariablesService {

  diagram: DiagramComponent;
  dialog: DialogComponent;
  connected_component_id_index = {};//connected_component_id : index of node in diagram with this id
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
  port_value_table: { [source_component_index: string]: { [target_component_index: number]: { [source_port_index: number]: { [target_port_index: number]: Subject<OutputEvent> } } } } = {};
  port_observables_table: { [k: string]: any } = {}

  changePortValue(value: boolean, port_index, component_index) {
    console.log("port value table", this.port_value_table)
    console.log("params", component_index, port_index, value)
    if (component_index in this.port_value_table) {
      //change port value in node
      let source_node = this.diagram.nodes[component_index]
      let port = source_node.ports[port_index]
      port.addInfo[addInfo_simValue] = value
      //
      Object.keys(this.port_value_table[component_index]).forEach(target_component_index => {
        // console.log("targets", target_port_id)
        console.log("target component index", target_component_index)
        let target_ports = this.port_value_table[component_index][target_component_index][port_index] || null
        console.log("target ports", target_ports)
        if (target_ports != null) {
          Object.keys(target_ports).forEach(target_port_index => {
            target_ports[target_port_index].next({ value: value, target_node_index: target_component_index, target_port_index: target_port_index, source_node_index: component_index, source_port_index: port_index })
          })
        }

      })

    }
  }

  addOutputEvent(source_port_index: number, source_component_index: number, target_port_index: number, target_component_index: number): Observable<OutputEvent> {
    //init
    console.log("add output event ", source_component_index)
    this.port_value_table[source_component_index] = this.port_value_table[source_component_index] || {}
    this.port_observables_table[source_component_index] = this.port_observables_table[source_component_index] || {}
    //
    this.port_value_table[source_component_index][target_component_index] = this.port_value_table[source_component_index][target_component_index] || {}
    this.port_observables_table[source_component_index][target_component_index] = this.port_observables_table[source_component_index][target_component_index] || {}
    //
    this.port_value_table[source_component_index][target_component_index][source_port_index] = this.port_value_table[source_component_index][target_component_index][source_port_index] || {}
    this.port_observables_table[source_component_index][target_component_index][source_port_index] = this.port_observables_table[source_component_index][target_component_index][source_port_index] || {}
    //end init
    //create event of connector target and source,as when source port changes ,change all target ports binded to this source
    this.port_value_table[source_component_index][target_component_index][source_port_index][target_port_index] = new Subject()
    this.port_observables_table[source_component_index][target_component_index][source_port_index][target_port_index] = this.port_value_table[source_component_index][target_component_index][source_port_index][target_port_index].asObservable();
    console.log("add output:", this.port_observables_table[source_component_index][target_component_index][source_port_index][target_port_index])
    return this.port_observables_table[source_component_index][target_component_index][source_port_index][target_port_index];

  }
  //////////////////
  domainbaseurl = "http://localhost:3000/"
  baseurl = `${this.domainbaseurl}api`
  imageUrl = `${this.domainbaseurl}component/`



}
