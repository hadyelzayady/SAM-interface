import { Component, ViewChild, EventEmitter, Output } from '@angular/core';
import { DiagramModule, DiagramComponent, ConnectorModel, PointPortModel, IConnectionChangeEventArgs, Connector, ISelectionChangeEventArgs, ContextMenuSettingsModel } from '@syncfusion/ej2-angular-diagrams';
import { ToolbarItems, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { ClickEventArgs, ToolbarComponent } from '@syncfusion/ej2-angular-navigations';
import { SharedVariablesService } from './shared-variables.service';
import { ToolBarComponent } from './tool-bar/tool-bar.component';


interface ConnectorEnd {
  nodeId: string,
  portId: string
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild("diagram")
  public diagram: DiagramComponent;

  @ViewChild(ToolBarComponent)
  private toolBar: ToolBarComponent;

  private connections = {}

  public contextMenuSettings: ContextMenuSettingsModel;
  title = 'SAM-interface';
  constructor(public data: SharedVariablesService) {
  }
  ngOnInit(): void {
    this.data.diagram = this.diagram;

    this.contextMenuSettings = {
      show: true,
    }
  }

  selectionChangeEvent(args: ISelectionChangeEventArgs) {
    if (args.state == "Changed") {
      this.toolBar.boardSelected(args);
    }
  }

  addToConnectionsTable(connector: ConnectorModel, portId: string): void {
    if (portId != "") {
      this.connections[connector.sourceID][connector.sourcePortID] = { "nodeId": connector.targetID, "portId": connector.targetPortID };

      this.connections[connector.targetID][connector.targetPortID] = { "nodeId": connector.sourceID, "portId": connector.sourcePortID }
    }
  }

  removeFromConnectionsTable(oldConnectorEnd: ConnectorEnd): void {
    console.log(oldConnectorEnd)
    // if (oldConnectorEnd.nodeId in this.connections && oldConnectorEnd.portId in this.connections[oldConnectorEnd.nodeId])

  }
  connectorEvent(args: IConnectionChangeEventArgs) {
    console.log(args)
    if (args.state == "Changed") {
      if ((args.newValue as { nodeId: string, portId: string }).portId == "") {
        this.removeFromConnectionsTable(<ConnectorEnd>args.oldValue)
        if (args.connectorEnd === "ConnectorSourceEnd")
          args.connector.sourceDecorator = { shape: 'Circle', style: { fill: 'Black' }, };
        else if (args.connectorEnd === "ConnectorTargetEnd")
          args.connector.targetDecorator = { shape: 'Circle', style: { fill: 'Black' }, };
      }
      else // connected to port
      {
        if (args.connectorEnd === "ConnectorSourceEnd") {
          this.addToConnectionsTable(args.connector, args.connector.targetPortID);
          args.connector.sourceDecorator = { shape: 'Circle', style: { fill: 'Green' }, };
        }
        else {
          this.addToConnectionsTable(args.connector, args.connector.sourcePortID);
          args.connector.targetDecorator = { shape: 'Circle', style: { fill: 'Green' }, };
        }

      }
    }
  }

}
