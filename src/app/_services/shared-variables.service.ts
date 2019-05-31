import { Injectable } from '@angular/core';
import { DiagramComponent } from '@syncfusion/ej2-angular-diagrams';
import { FilenameDialogComponent } from '../filename-dialog/filename-dialog.component';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { OutputEvent } from '../_models';
import { addInfo_simValue, addInfo_type, ComponentType } from '../utils';


@Injectable()
export class SharedVariablesService {

  pin_inputs_bit_index: {
    [target_node_index: number]: {
      [target_pin_index: number]: {
        [source_node_index: number]: { [source_pin_index: number]: number }
      }
    }
  }
  setPinInputBit(source_node_index: any, source_port_index: number, target_node_index: any, target_port_index: number) {
    //init  
    this.pin_inputs_bit_values[target_node_index] = this.pin_inputs_bit_values[target_node_index] || {}
    this.pin_inputs_bit_values[target_node_index][target_port_index] = this.pin_inputs_bit_values[target_node_index][target_port_index] || ""

    this.pin_inputs_bit_index[target_node_index] = this.pin_inputs_bit_index[target_node_index] || {}

    this.pin_inputs_bit_index[target_node_index][target_port_index] = this.pin_inputs_bit_index[target_node_index][target_port_index] || {}

    this.pin_inputs_bit_index[target_node_index][target_port_index][source_node_index] = this.pin_inputs_bit_index[target_node_index][target_port_index][source_node_index] || {}

    //ens init
    this.pin_inputs_bit_values[target_node_index][target_port_index] += "0"
    this.pin_inputs_bit_index[target_node_index][target_port_index][source_node_index][source_port_index] = this.pin_inputs_bit_values[target_node_index][target_port_index].length
    //
  }
  saved_design: boolean = true
  diagram: DiagramComponent;
  dialog: DialogComponent;
  connected_component_id_index = {};//connected_component_id : index of node in diagram with this id
  nodeid_index = {} // settd in simulation button before get_desin_conections
  // sim_mode: boolean = false;
  /////////////
  //called when design component is destroyed so every subscriber subscribes from it
  public unsubscribe_sim: Subject<void> = new Subject();

  private sim_mode: Subject<boolean> = new Subject();
  currentMode = this.sim_mode.asObservable();
  changeMode(mode: boolean) {
    this.sim_mode.next(mode)
  }

  private logedin: Subject<boolean> = new Subject();
  currentloginstatus = this.logedin.asObservable();
  changeLogin(mode: boolean) {
    this.logedin.next(mode)

  }
  /////////////
  ////////////////
  port_value_table: { [source_component_index: string]: { [target_component_index: number]: { [source_pin_index: number]: { [target_port_index: number]: Subject<OutputEvent> } } } } = {};
  port_observables_table: { [k: string]: any } = {}


  pin_inputs_bit_values: { [target_node_index: string]: { [target_pin_index: number]: string } }

  changePortValue(value: boolean, port_index: number, component_index: number, source_node_index: number, source_pin_index: number) {
    // console.log("port value table", this.port_value_table)
    // console.log("params", component_index, port_index, value)
    // console.log("bit vaue", this.pin_inputs_bit_values[component_index])
    let _value = this.updatePinBitAndGetValue(value, component_index, port_index, source_node_index, source_pin_index)
    if (component_index in this.port_value_table) {
      // console.log("exist", _value)
      //change port value in node
      //oring all input of this node to get final value
      //if pin source value comes from from actual hardware then its identifies is itself(its pin index and board index)
      //which means component_index=source_node_index  
      let final_value = value || _value
      //
      let source_node = this.diagram.nodes[component_index]
      let port = source_node.ports[port_index]
      port.addInfo[addInfo_simValue] = final_value
      //
      Object.keys(this.port_value_table[component_index]).forEach(target_component_index => {
        // console.log("targets", target_port_id)
        // console.log("target component index", target_component_index)
        let target_ports = this.port_value_table[component_index][target_component_index][port_index] || null
        // console.log("target ports", target_ports)
        if (target_ports != null) {
          Object.keys(target_ports).forEach(target_port_index => {
            target_ports[target_port_index].next({ value: value, target_node_index: target_component_index, target_port_index: target_port_index, source_node_index: component_index, source_port_index: port_index })
          })
        }

      })

    } else {
      // console.log("led change port,led value", this.pin_inputs_bit_values[component_index][port_index])
      //this component does not output to anything like the led
      let final_value = value || _value
      //
      let source_node = this.diagram.nodes[component_index]
      let port = source_node.ports[port_index]
      port.addInfo[addInfo_simValue] = final_value
      // console.log("2led change port,led value", this.pin_inputs_bit_values[component_index][port_index], final_value)
    }
  }
  updatePinBitAndGetValue(value: boolean, component_index: number, port_index: number, source_node_index: number, source_pin_index: number) {
    //if value comes from actual hardware then board pin won't have
    //value in pi_inputs_bit as its output pin
    if (this.diagram.nodes[component_index].addInfo[addInfo_type] == ComponentType.Hardware) {
      return false //to get the actual value of pin
    }
    // console.log("he")
    let source_bit_index = this.pin_inputs_bit_index[component_index][port_index][source_node_index][source_pin_index]
    let str_val = value ? "1" : "0"
    // console.log("str value", str_val)
    let target_value = this.pin_inputs_bit_values[component_index][port_index]
    // console.log("new value", target_value)
    let new_val = target_value.substr(0, source_bit_index) + str_val + target_value.substr(source_bit_index + 1)
    this.pin_inputs_bit_values[component_index][port_index] = new_val

    return this.pin_inputs_bit_values[component_index][port_index].includes("1")
  }


  addOutputEvent(source_port_index: number, source_component_index: number, target_port_index: number, target_component_index: number): Observable<OutputEvent> {
    //init
    // console.log("add output event ", source_component_index)
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
    // // console.log("add output:", this.port_observables_table[source_component_index][target_component_index][source_port_index][target_port_index])
    return this.port_observables_table[source_component_index][target_component_index][source_port_index][target_port_index];

  }
  //////////////////
  domainbaseurl_without_port = "http://192.168.1.3"
  domainbaseurl = `${this.domainbaseurl_without_port}:80/`
  baseurl = `${this.domainbaseurl}api`
  imageUrl = `${this.domainbaseurl}component/`
  localhost_trayapp = "http://localhost:4000/"

  web_socket_server_url = `${this.domainbaseurl_without_port}:3001`
  //ip,port of user for simuation as board sends to this ip,port (udp)
  ip = null //local ip of user
  port = null //local udp server port

}
