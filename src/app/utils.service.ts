import { Injectable } from '@angular/core';
import { ConnectorModel, ConnectorConstraints } from '@syncfusion/ej2-diagrams';
import { SharedVariablesService } from './shared-variables.service';
import { DiagramComponent } from '@syncfusion/ej2-angular-diagrams';
import { Arduino } from './models/arduino';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }
  getConnector(): ConnectorModel {
    return {
      type: 'Orthogonal',
      constraints: ConnectorConstraints.Default | ConnectorConstraints.Bridging,
    }
  }

  makeConnections(diagram: DiagramComponent): any {
    let connections = {}
    console.log("make connections")
    diagram.connectors.forEach(connector => {
      if (connector.targetID != "" && connector.sourceID != "") {
        connections[connector.sourceID][connector.sourcePortID] = { "nodeId": connector.targetID, "portId": connector.targetPortID, "type": "I" };

        connections[connector.targetID][connector.targetPortID] = { "nodeId": connector.sourceID, "portId": connector.sourcePortID, "type": "O" }
      }
    });
    return connections;

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
