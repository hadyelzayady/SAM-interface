import { Injectable } from '@angular/core';
import { ConnectorModel, ConnectorConstraints, NodeModel } from '@syncfusion/ej2-angular-diagrams';
import { SharedVariablesService } from './shared-variables.service';
import { DiagramComponent, DiagramAllModule } from '@syncfusion/ej2-angular-diagrams';
import { Arduino } from '../_models/arduino';
import { addInfo_componentId, addInfo_type, ComponentType, addInfo_connectedComponentId, addinfo_IP_Port } from '../utils';


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

  getDesignConnections(): any {
    let connections: { [key: string]: string } = {}
    let nodeid_index = this.sharedData.nodeid_index
    let nodes = this.sharedData.diagram.nodes
    this.sharedData.diagram.connectors.forEach(function (connector) {
      if (connector.targetID != "" && connector.sourceID != "") {
        // let connectedcomponent_id= this.sharedData.

        let O_Component = nodes[nodeid_index[connector.sourceID]]
        let I_Component = nodes[nodeid_index[connector.targetID]]

        let source_pin = connector.sourcePortID
        let destination_pin = connector.sourcePortID
        let destination_ip_port = I_Component.addInfo[addinfo_IP_Port]
        if (!(O_Component.addInfo[addInfo_connectedComponentId] in connections)) {
          connections[O_Component.addInfo[addInfo_connectedComponentId]] = ''
        }
        if (!(I_Component.addInfo[addInfo_connectedComponentId]! in connections)) {
          connections[I_Component.addInfo[addInfo_connectedComponentId]] = ''
        }

        connections[O_Component.addInfo[addInfo_connectedComponentId]] += `"O":${source_pin}:${destination_ip_port}:${destination_pin},`

        connections[I_Component.addInfo[addInfo_connectedComponentId]] += `"I":${destination_pin},`

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
  // readingEnded = (e): string => { return e.target.result }
  // readFile(file: File) {
  //   let reader = new FileReader()
  //   reader.onloadend = this.readingEnded;
  //   reader.readAsText(file)
  //   console.log(reader.result)
  //   console.log(this.readingEnded)
  // }
}
