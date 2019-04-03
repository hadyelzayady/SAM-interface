import { Component, ViewChild, EventEmitter, Output, OnInit, AfterViewInit } from '@angular/core';
import { DiagramModule, DiagramComponent, ConnectorModel, PointPortModel, IConnectionChangeEventArgs, Connector, ISelectionChangeEventArgs, ContextMenuSettingsModel, IHistoryChangeArgs, UndoRedo, ConnectorConstraints, NodeConstraints } from '@syncfusion/ej2-angular-diagrams';
import { ToolbarItems, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { ClickEventArgs, ToolbarComponent } from '@syncfusion/ej2-angular-navigations';
import { SharedVariablesService } from '../_services/shared-variables.service';
import { ToolBarComponent } from '../tool-bar/tool-bar.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DesignService } from '../_services';
import { nodeSimConstraints, connectorSimConstraints, nodeDesignConstraints, connectorDesignConstraints } from '../utils';

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


  sim_mode = false;
  @ViewChild("diagram")
  public diagram: DiagramComponent;

  @ViewChild(ToolBarComponent)
  private toolBar: ToolBarComponent;

  private connections = {}
  private file_id: number;
  public contextMenuSettings: ContextMenuSettingsModel;
  title = 'SAM-interface';
  constructor(public sharedData: SharedVariablesService, private route: ActivatedRoute, private designService: DesignService, private approute: Router) {
  }

  create(args) {
    console.log(args)
  }

  ngOnInit(): void {
    this.sharedData.diagram = this.diagram;

    this.contextMenuSettings = {
      show: true,
    }
    this.file_id = +this.route.snapshot.paramMap.get('id');
    this.sharedData.currentMode.subscribe(sim_mode => {
      this.sim_mode = sim_mode;
      this.setConstraints(sim_mode)
    });
  }

  setConstraints(sim_mode: boolean) {
    if (sim_mode) {
      this.diagram.nodes.forEach(node => {
        node.constraints = nodeSimConstraints;
      });
      this.diagram.connectors.forEach(connector => {
        connector.constraints = connectorSimConstraints;
      });
    }

    else {
      this.diagram.nodes.forEach(node => {
        node.constraints = nodeDesignConstraints;
      });
      this.diagram.connectors.forEach(connector => {
        connector.constraints = connectorDesignConstraints;
      });
    }
  }
  drag() {
    console.log("drag enter")
  }
  loadDesignFile(): void {

    // this.file_id = +this.route.snapshot.paramMap.get('id');

    this.designService.getDesignFileById(this.file_id)
      .subscribe(file => {
        try {
          // console.log(JSON.stringify(file))
          if (file != null)
            this.diagram.loadDiagram(JSON.stringify(file))
          else
            this.diagram.reset();
        } catch (error) {
          console.log(error)
          this.approute.navigate(["home"])
          alert("error on loading design ,fie reseted")
        }
      }, error => {
        this.approute.navigate(["home"])
        console.log("after reroute")


      });
  }

  diagramCreated() {
    this.loadDesignFile();
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
