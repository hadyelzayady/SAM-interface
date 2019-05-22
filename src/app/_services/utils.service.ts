import { Injectable } from '@angular/core';
import { ConnectorModel, ConnectorConstraints, NodeModel } from '@syncfusion/ej2-angular-diagrams';
import { SharedVariablesService } from './shared-variables.service';
import { DiagramComponent, DiagramAllModule } from '@syncfusion/ej2-angular-diagrams';
import { Arduino } from '../_models/arduino';
import { addInfo_componentId, addInfo_type, ComponentType, addInfo_connectedComponentId, addinfo_port, addinfo_IP } from '../utils';


@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(private sharedData: SharedVariablesService) { }
  getConnector(): NodeModel | ConnectorModel {
    return {
      type: 'Orthogonal',
      constraints: ConnectorConstraints.Default | ConnectorConstraints.Bridging,
    }
  }
  globalPinId_boardid_portid: { [global_pin_id: number]: { component_index: number, port_index: number } } = {}
  getDesignConnections(): any {
    let global_pin_number = 0
    let connections: { [key: string]: string } = {}
    let nodeid_index = this.sharedData.nodeid_index
    let nodes = this.sharedData.diagram.nodes
    let globalPinId_boardid_portid = this.globalPinId_boardid_portid
    this.sharedData.diagram.connectors.forEach(function (connector) {
      if (connector.targetID != "" && connector.sourceID != "") {
        // let connectedcomponent_id= this.sharedData.
        let O_Component = nodes[nodeid_index[connector.sourceID]]
        let I_Component = nodes[nodeid_index[connector.targetID]]

        let source_pin = connector.sourcePortID
        let destination_pin = connector.targetPortID
        let destination_ip_port = I_Component.addInfo[addinfo_IP] + ":" + I_Component.addInfo[addinfo_port]
        //map each HW output port to global pin id
        if (I_Component.addInfo[addInfo_type] == ComponentType.Software) {
          //if board outputs to software(I_component is switch or led) then send the destination as the board pin itself as we bind outputs to the board pin of the board  ,not like if board1 is connected to board2 then the destination will be the pin in board2
          let original_destinaion_pin = destination_pin
          let destination_pin_number = global_pin_number++
          destination_pin = "" + destination_pin_number
          let O_Component_index = nodeid_index[O_Component.id]
          //get port index
          let port_index = O_Component.ports.findIndex(port => {
            return port.id == connector.sourcePortID
          })
          globalPinId_boardid_portid[destination_pin_number] = { component_index: O_Component_index, port_index: port_index }
        }
        //
        if (O_Component.addInfo[addInfo_type] == ComponentType.Hardware) {
          //output  not from switch
          if (!(O_Component.addInfo[addInfo_connectedComponentId] in connections)) {
            connections[O_Component.addInfo[addInfo_connectedComponentId]] = ''
          }
          connections[O_Component.addInfo[addInfo_connectedComponentId]] += `O:${source_pin}:${destination_ip_port}:${destination_pin},`
        }
        if (I_Component.addInfo[addInfo_type] == ComponentType.Hardware) {
          //so led for example won't be sent to the server,target not let or switch input pin
          if (!(I_Component.addInfo[addInfo_connectedComponentId] in connections)) {
            connections[I_Component.addInfo[addInfo_connectedComponentId]] = ''
          }
          connections[I_Component.addInfo[addInfo_connectedComponentId]] += `I:${destination_pin}:${O_Component.addInfo[addinfo_IP]},`
        }

      }
    });
    return connections;

  }

  //return component id as key with quantity as value,only components that not software sim
  getDesignComponents(diagram: DiagramComponent) {
    let components = {}
    diagram.nodes.forEach(function (node) {
      if (node.addInfo[addInfo_type] == ComponentType.Hardware) {
        if (node.addInfo[addInfo_componentId] in components)
          components[node.addInfo[addInfo_componentId]] += 1
        else
          components[node.addInfo[addInfo_componentId]] = 1
      }

    });
    return components;

  }
  // // readingEnded = (e): string => { return e.target.result }
  // readFile(file: File) {
  //   let reader = new FileReader()
  //   reader.onloadend = this.readingEnded;
  //   reader.readAsText(file)
  //   console.log(reader.result)
  //   console.log(this.readingEnded)
  // }
}
