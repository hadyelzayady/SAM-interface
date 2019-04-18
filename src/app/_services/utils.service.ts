import { Injectable } from '@angular/core';
import { ConnectorModel, ConnectorConstraints, NodeModel } from '@syncfusion/ej2-diagrams';
import { SharedVariablesService } from './shared-variables.service';
import { DiagramComponent, DiagramAllModule } from '@syncfusion/ej2-angular-diagrams';
import { Arduino } from '../_models/arduino';
import { ReserveComponents } from '../_models';


@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }
  getConnector(): NodeModel | ConnectorModel {
    return {
      type: 'Orthogonal',
      constraints: ConnectorConstraints.Default | ConnectorConstraints.Bridging,
    }
  }

  getDesignConnections(diagram: DiagramComponent): any {
    let connections = {}
    console.log("make connections")
    diagram.connectors.forEach(function (connector) {
      if (connector.targetID != "" && connector.sourceID != "") {
        if (!(connector.sourceID in connections)) {
          console.log("inside cond")
          connections[connector.sourceID] = {};
          connections[connector.targetID] = {};
        }
        connections[connector.sourceID][connector.sourcePortID] = { "nodeId": connector.targetID, "portId": connector.targetPortID, "type": "I" };

        connections[connector.targetID][connector.targetPortID] = { "nodeId": connector.sourceID, "portId": connector.sourcePortID, "type": "O" }
      }
    });
    return connections;

  }

  //return component id as key with quantity as value
  getDesignComponents(diagram: DiagramComponent) {
    let components = {}
    diagram.nodes.forEach(function (node) {
      if (node.addInfo["ComponentId"] in components)
        components[node.addInfo["ComponentId"]] += 1
      else
        components[node.addInfo["ComponentId"]] = 1
    });
    console.log(components)
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
