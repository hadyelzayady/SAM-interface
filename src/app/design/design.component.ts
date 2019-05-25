import { Component, ViewChild, EventEmitter, Output, OnInit, AfterViewInit } from '@angular/core';
import { DiagramModule, DiagramComponent, ConnectorModel, PointPortModel, IConnectionChangeEventArgs, Connector, ISelectionChangeEventArgs, ContextMenuItemModel, IHistoryChangeArgs, UndoRedo, ConnectorConstraints, NodeConstraints, DiagramConstraints, Keys, CommandManager, KeyModifiers, ContextMenuSettings, ContextMenuSettingsModel, IDoubleClickEventArgs } from '@syncfusion/ej2-angular-diagrams';
import { ClickEventArgs, ToolbarComponent, ContextMenu, MenuEventArgs } from '@syncfusion/ej2-angular-navigations';
import { SharedVariablesService } from '../_services/shared-variables.service';
import { ToolBarComponent } from '../tool-bar/tool-bar.component';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { DesignService } from '../_services';
import { nodeSimConstraints, connectorSimConstraints, nodeDesignConstraints, connectorDesignConstraints, addInfo_name, addInfo_simValue, addinfo_IP, addinfo_port, addInfo_isBinded, addInfo_reserved } from '../utils';
import { takeUntil, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { LocalWebSocketService } from '../_services/local-web-socket.service';
import { RoutingStateService } from '../_services/routing-state.service';
import { select } from '@syncfusion/ej2-base';
import { ContextMenuClickEventArgs } from '@syncfusion/ej2-grids';
import { Switch } from '../_models/Switch';
import { SocketEvent } from '../_models/event';
import { Event as NavigationEvent } from "@angular/router";
import { CanDeactivateComponent } from '../can-deactivate/can-deactivate.component';
//TODO enable context menu 
interface ConnectorEnd {
  nodeId: string,
  portId: string
}
@Component({
  selector: 'app-design',
  templateUrl: './design.component.html',
  styleUrls: ['./design.component.css']
})
export class DesignComponent extends CanDeactivateComponent {


  sim_mode = false;
  @ViewChild("diagram")
  public diagram: DiagramComponent;
  public commandManager: CommandManager;
  @ViewChild(ToolBarComponent)
  toolBar: ToolBarComponent;
  connections = {}
  public file_id: number;
  public contextMenuSettings: ContextMenuSettingsModel;
  title = 'SAM-interface';
  constructor(public sharedData: SharedVariablesService, private route: ActivatedRoute, private designService: DesignService, private approute: Router, private localSocketService: LocalWebSocketService, private routingState: RoutingStateService) {
    super()

  }



  previousRoute: string;
  ngOnInit(): void {


    this.previousRoute = this.routingState.getPreviousUrl();
    // console.log(this.previousRoute)
    this.sharedData.diagram = this.diagram;
    this.contextMenuSettings = {
      show: true,
    }

    this.setCommandManager()
    this.file_id = +this.route.snapshot.paramMap.get('id');
    this.sharedData.currentMode.pipe(takeUntil(this.sharedData.unsubscribe_sim)).subscribe(sim_mode => {
      this.sim_mode = sim_mode;
      this.setConstraints(sim_mode)
    });

  }
  canDeactivate(): boolean {
    return this.sharedData.saved_design
  }
  setCommandManager() {
    let mythis = this
    this.diagram.commandManager = {
      commands: [{
        name: "paste",
        canExecute: function () {
          return !mythis.sim_mode
        }
      },
      {
        name: "cut",
        canExecute: function () {
          return !mythis.sim_mode
        }
      },
      {
        name: 'copy',
        canExecute: function () {
          // // console.log("canExute", mythis.sim_mode)
          return !mythis.sim_mode
        }

      },
      {
        name: "undo",
        canExecute: function () {
          return !mythis.sim_mode
        }
      },
      {
        name: "redo",
        canExecute: function () {
          return !mythis.sim_mode
        }
      }
      ]
    }
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.sharedData
  }
  historyChange(args: IHistoryChangeArgs) {
    // console.log(args)
  }

  setSimContextMenu() {
    // this.contextMenuSettings = {
    //   show: true,
    //   items: [{
    //     text: "Cut",
    //     id: "Cut"
    //   }],
    //   showCustomMenuOnly: true
    // }
  }
  contextClick(args: ContextMenuClickEventArgs) {
    // console.log("context menu click", args)
  }
  doubleClick(args: IDoubleClickEventArgs) {
    // console.log("double click", args)
    // // if (args.count == 1) {
    // let clicked_node = args.source.nodes || null
    // if (clicked_node[0].addInfo[addInfo_name] == Switch.name && this.sim_mode) {
    //   Switch.Toggle(clicked_node[0])
    //   this.diagram.dataBind()
    // }
    // }
  }
  setConstraints(sim_mode: boolean) {
    if (sim_mode) {
      this.diagram.nodes.forEach(node => {
        node.constraints = nodeSimConstraints;
      });
      this.diagram.connectors.forEach(connector => {
        connector.constraints = connectorSimConstraints;
      });

      // command manager for shortcuts
      // this.setSimContextMenu()
      //this should be the last line
      // this.diagram.refresh()

    }

    else {
      this.diagram.nodes.forEach(node => {
        node.constraints = nodeDesignConstraints;
      });
      this.diagram.connectors.forEach(connector => {
        connector.constraints = connectorDesignConstraints;
      });
      // this.contextMenuSettings = {
      //   show: true
      // }

      //this should be the last line
    }
  }

  loadDesignFile(): void {

    // this.file_id = +this.route.snapshot.paramMap.get('id');
    //TODO: reset addinfo for component like binded and etc
    this.designService.getDesignFileById(this.file_id)
      .subscribe(file => {
        try {
          // console.log(JSON.stringify(file))
          if (file != null) {
            this.diagram.loadDiagram(JSON.stringify(file))
            this.diagram.nodes.forEach(node => {
              node.addInfo[addinfo_IP] = null
              node.addInfo[addinfo_port] = null
              node.addInfo[addInfo_simValue] = false
              node.addInfo[addInfo_isBinded] = false
              node.addInfo[addInfo_reserved] = false
              node.ports.forEach(element => {
                element.addInfo[addInfo_simValue] = false
              });
            })
            this.diagram.refreshDiagram()
          }

          else {
            this.diagram.reset();
            this.diagram.dataBind()

          }
        } catch (error) {
          this.approute.navigate(["home"])
          alert("error on loading design ,fie reseted")
        }
      }, error => {
        this.approute.navigate(["home"])
      });
  }

  diagramCreated() {
    this.loadDesignFile();
    this.diagram.refreshDiagramLayer()
    // console.log(this.sharedData.diagram.historyManager.currentEntry)
  }

  selectionChangeEvent(args: ISelectionChangeEventArgs) {
    if (args.state == "Changed") {
      console.log("selec")
      this.toolBar.boardSelected(args);
    }
  }

  getDesignConnections(): any {
    let connections = {}
    this.diagram.connectors.forEach(function (connector) {
      if (connector.targetID != "" && connector.sourceID != "") {
        if (!(connector.sourceID in connections)) {
          connections[connector.sourceID] = {};
          connections[connector.targetID] = {};
        }
        connections[connector.sourceID][connector.sourcePortID] = { "nodeId": connector.targetID, "portId": connector.targetPortID, "type": "I" };

        connections[connector.targetID][connector.targetPortID] = { "nodeId": connector.sourceID, "portId": connector.sourcePortID, "type": "O" }
      }
    });
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
