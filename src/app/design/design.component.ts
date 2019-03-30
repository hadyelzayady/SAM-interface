import { Component, ViewChild, EventEmitter, Output, OnInit } from '@angular/core';
import { DiagramModule, DiagramComponent, ConnectorModel, PointPortModel, IConnectionChangeEventArgs, Connector, ISelectionChangeEventArgs, ContextMenuSettingsModel, IHistoryChangeArgs, UndoRedo } from '@syncfusion/ej2-angular-diagrams';
import { ToolbarItems, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { ClickEventArgs, ToolbarComponent } from '@syncfusion/ej2-angular-navigations';
import { SharedVariablesService } from '../_services/shared-variables.service';
import { ToolBarComponent } from '../tool-bar/tool-bar.component';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../_services';


interface ConnectorEnd {
  nodeId: string,
  portId: string
}
@Component({
  selector: 'app-design',
  templateUrl: './design.component.html',
  styleUrls: ['./design.component.css']
})
export class DesignComponent {

  @ViewChild("diagram")
  public diagram: DiagramComponent;

  @ViewChild(ToolBarComponent)
  private toolBar: ToolBarComponent;

  private connections = {}

  public contextMenuSettings: ContextMenuSettingsModel;
  title = 'SAM-interface';
  constructor(public data: SharedVariablesService, private route: ActivatedRoute, private userService: UserService) {
  }

  create(args) {
    console.log(args)
  }
  ngOnInit(): void {
    this.data.diagram = this.diagram;

    this.contextMenuSettings = {
      show: true,
    }
    this.loadDesignFile();
  }

  loadDesignFile(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.userService.getDesignFileById(id)
      .subscribe(file => {
        try {
          this.diagram.loadDiagram(JSON.stringify(file));
        } catch (error) {
          alert("error on loading design ,fie reseted")
          this.diagram.reset();
        }
      });
  }

  selectionChangeEvent(args: ISelectionChangeEventArgs) {
    if (args.state == "Changed") {
      this.toolBar.boardSelected(args);
    }
  }

  getDesignConnections(): any {
    let connections = {}
    console.log("make connections")
    this.diagram.connectors.forEach(function (connector) {
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
    console.log(connections)
    return connections;

  }
  connectorEvent(args: IConnectionChangeEventArgs) {
    if (args.state == "Changed") {
      if ((<ConnectorEnd>args.newValue).portId == "") {
        if (args.connectorEnd === "ConnectorSourceEnd")
          args.connector.sourceDecorator = { shape: 'Circle', style: { fill: 'Black' }, };
        else if (args.connectorEnd === "ConnectorTargetEnd")
          args.connector.targetDecorator = { shape: 'Arrow', style: { fill: 'Black' }, };
      }
      else // connected to port
      {
        if (args.connectorEnd === "ConnectorSourceEnd") {
          args.connector.sourceDecorator = { shape: 'Circle', style: { fill: 'Green' }, };
        }
        else {
          args.connector.targetDecorator = { shape: 'Arrow', style: { fill: 'Green' }, };
        }

      }
    }
  }


}
