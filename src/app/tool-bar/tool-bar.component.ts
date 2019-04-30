import { Component, ViewEncapsulation, Inject, ViewChild, AfterViewInit, Input } from '@angular/core';
import { cssClass } from '@syncfusion/ej2-lists';
import { AppComponent } from '../app.component';
import { SharedVariablesService, UtilsService, DesignService } from '../_services';
import { DiagramTools, ConnectorConstraints, ConnectorModel, NodeConstraints, ISelectionChangeEventArgs, EventState, ChangeType, NodeModel } from '@syncfusion/ej2-angular-diagrams';
import { ItemModel, ToolbarComponent, ClickEventArgs, Item } from '@syncfusion/ej2-angular-navigations';
import { ToolbarItem } from '@syncfusion/ej2-grids';
import { InputEventArgs, UploadingEventArgs } from '@syncfusion/ej2-inputs';
import { DiagramApiService } from '../_services/diagram-api.service';
import { FilesDirective } from '@syncfusion/ej2-angular-inputs';
import { ReserveComponentsResponse } from '../_models';
import { addInfo_componentId, addInfo_reserved, addInfo_connectedComponentId, addInfo_name, addInfo_type, ComponentType, addinfo_IP_Port } from '../utils';
import { ModalService } from '../modal.service';
import { finalize, takeUntil } from 'rxjs/operators';
import { WebSocketService } from '../_services/web-socket.service';
import { SimCommunicationService } from '../_services/sim-communication.service';
import { Led } from '../_models/Led';
import { Subject } from 'rxjs';
import { SocketEvent } from '../_models/event';
import { LocalWebSocketService } from '../_services/local-web-socket.service';

@Component({
  selector: 'app-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ToolBarComponent {

  boards_code: { [key: string]: File; } = {};
  hide_fileupload = true;
  hide_component_interacts_sim = true;
  sim_mode = false;
  selected_file = "no code file selected"
  ///////////reserve modal variables
  status = ""
  parsed = false;
  reserved = false;
  configured = false;
  error_parsed = false;
  error_reserved = false;
  error_config = false;
  reserve_modal_id = "reserve"
  hide_modal_close_btn = true
  //added for sim
  prepared = false
  error_prepared = false
  error_send_connections = false
  send_connections = false
  simulate_modal_id = "simulate"
  //websocket
  connected = false
  error_connected = false
  local_connected = false
  error_local_connected = false
  //////////////

  @ViewChild("toolbar_design") public designToolbar: ToolbarComponent;
  @ViewChild("toolbar_sim") public simToolbar: ToolbarComponent;
  @Input() file_id: number;
  undo_id = "undo"
  redo_id = "redo"
  zoomin_id = "zoomin"
  zoomout_id = "zoomout"
  connector_id = "connector"
  fileupload_id = 'fileupload'
  simulate_id = "simulate"
  reserve_id = "reserve"
  reset_id = "reset"
  // to unsubscribe from observables when sim ends
  private unsubscribe: Subject<void> = new Subject();

  //TODO: merge diagram service in designservice
  constructor(public sharedData: SharedVariablesService, public utils: UtilsService, public diagramService: DiagramApiService, private designService: DesignService, private modalService: ModalService, private simComm: SimCommunicationService, private LocalCommService: LocalWebSocketService) {

  }

  fileInputChange(event) {
    let board_id = this.sharedData.diagram.selectedItems.nodes[0].id
    let file = event.target.files[0]
    this.boards_code[board_id] = file
    this.selected_file = file.name
  }
  setOneBoardActionButtonsVisibility(visibility: boolean) {
    this.simToolbar.hideItem(4, !visibility)
  }
  selected_board;
  boardSelected(args: ISelectionChangeEventArgs) {
    let nodes = this.sharedData.diagram.selectedItems.nodes
    if (nodes.length == 1) {
      if (!this.sim_mode) {
        this.hide_fileupload = false;
        if (this.sharedData.diagram.selectedItems.nodes[0].id in this.boards_code) {
          this.selected_file = this.boards_code[this.sharedData.diagram.selectedItems.nodes[0].id].name
        }
        else {
          this.selected_file = "no code file selected"
        }
      } else {
        //sim mode ,show on/off reset
        this.selected_board = nodes[0]
        this.setOneBoardActionButtonsVisibility(true)

      }

    }
    else {
      this.hide_fileupload = true;
      this.setOneBoardActionButtonsVisibility(false)
    }

  }
  getBoardsCodeFiles(files: FileList, board_id: string[]): void {
    files = <FileList>{};
    let i = 0
    this.sharedData.diagram.nodes.forEach(node => {
      files[i] = this.boards_code[node.id]
      board_id[i] = node.id
      i++;
    });
  }

  resetComponents() {
    this.sharedData.diagram.nodes.forEach(node => {
      node.addInfo[addInfo_reserved] = false
    })
  }
  setComponentsReserveConfigs(reserved_comps: ReserveComponentsResponse[]) {
    let cache = {}
    // this.resetComponents()
    let reserved_index = 0
    let connected_components_id_index = {}
    let nodeid_index = {}
    this.sharedData.diagram.nodes.forEach((node, index) => {
      if (node.addInfo[addInfo_type] == ComponentType.Hardware) {
        if (node.addInfo[addInfo_componentId] in cache) {
          let componentId = node.addInfo[addInfo_componentId];
          node.addInfo[addInfo_reserved] = true;
          node.addInfo[addInfo_connectedComponentId] = reserved_comps[cache[componentId]].id
          node.addInfo[addinfo_IP_Port] = reserved_comps[cache[componentId]].IP + ":" + reserved_comps[cache[componentId]].port
          delete cache[componentId]
        }
        else {
          let found_component = false;
          for (reserved_index; reserved_index < reserved_comps.length; reserved_index++) {
            if (node.addInfo[addInfo_componentId] == reserved_comps[reserved_index].ComponentId) {
              node.addInfo[addInfo_reserved] = true;
              node.addInfo[addInfo_connectedComponentId] = reserved_comps[reserved_index].id
              node.addInfo[addinfo_IP_Port] = reserved_comps[reserved_index].IP + ":" + reserved_comps[reserved_index].port
              found_component = true;
              reserved_index++
              break;
            }
            else {
              cache[reserved_comps[index].ComponentId] = reserved_index
            }
          }
          if (!found_component)
            throw Error("error in config")
        }
        connected_components_id_index[node.addInfo[addInfo_connectedComponentId]] = index
        console.log("in for each:", connected_components_id_index)
      }
    });

    this.sharedData.connected_component_id_index = connected_components_id_index
    this.sharedData.nodeid_index = nodeid_index
  }
  //TODO: get reserved boards on loading design to save them in the table
  PrepareDiagramForOutput() {
    //TODO: should be merged with getconnections
    // console.log("table:", this.sharedData.diagram.node)
    this.sharedData.diagram.connectors.forEach((connector) => {
      let targetID = connector.targetID
      if (targetID.includes(Led.name)) {
        //! only works if source is connected to one target
        this.sharedData.addOutputEvent(connector.sourcePortID, this.sharedData.nodeid_index[connector.sourceID]).pipe(takeUntil(this.unsubscribe)).subscribe((val) => {
          let source;
          if (val)
            source = "../assets/redLED_on.jpg"
          else
            source = "../assets/redLED_off.jpg"
          try {
            this.sharedData.diagram.nodes[this.sharedData.nodeid_index[targetID]].shape = {
              type: 'Image',
              source: source
            }

          } catch (error) {
            console.log(error)
          }
        }, error => {
          console.log(error)
        })
      }
    })

    // this.sharedData.ports_values.subscribe((val) => {
    //   console.log("event in sim to chag eled")
    //   this.sharedData.diagram.nodes[0].shape = {
    //     type: 'Image',
    //     source: "../assets/redLED_on.jpg"
    //   }
    // })

  }
  customClose(id: string) {
    this.parsed = false;
    this.reserved = false;
    this.configured = false;
    this.error_parsed = false;
    this.error_reserved = false;
    this.error_config = false;
    this.hide_modal_close_btn = true
    //added for sim
    this.prepared = false
    this.error_prepared = false
    this.error_send_connections = false
    this.send_connections = false
    this.connected = false
    this.error_connected = false
    this.local_connected = false
    this.error_local_connected = false
    this.modalService.close(id)
  }
  //TODO: I receive boards id with port id ,from received map get board id in the design then get port id then change its value
  setConnectorSimValue(value: 1 | 0, board_id: string, port_id: string) {
    let x = this.sharedData.diagram.getObject(board_id) as NodeModel
    let port_index = x.ports.findIndex(port => port.id == port_id)
    if (value == 0) {
      this.sharedData.diagram.connectors[0].style.strokeWidth = 5;
      this.sharedData.diagram.connectors[0].style.strokeColor = '#183853';
    }
    else {
      this.sharedData.diagram.connectors[0].style.strokeWidth = 5;
      this.sharedData.diagram.connectors[0].style.strokeColor = '#31fd08';
    }
  }

  setNodeIdIndex() {
    let nodeid_index = this.sharedData.nodeid_index
    this.sharedData.diagram.nodes.forEach((node, index) => {
      nodeid_index[node.id] = index
    })
  }
  closeSimulationMode() {

    this.sim_mode = false
    this.sharedData.changeMode(this.sim_mode)
    this.unsubscribe.next()
    this.unsubscribe.complete();
    this.simComm.close()
    this.LocalCommService.close()
  }

  toolbarClick(args: ClickEventArgs): void {
    switch (args.item.id) {
      case this.undo_id: {
        if (this.sharedData.diagram.historyManager.canUndo) {
          this.sharedData.diagram.undo();
          break;
        }
        break;
      }
      case this.redo_id: {
        if (this.sharedData.diagram.historyManager.canRedo) {
          this.sharedData.diagram.redo();
          break;
        }
        break;
      }
      case this.zoomin_id: {
        this.sharedData.diagram.zoom(2);
        break;
      }
      case this.zoomout_id: {
        this.sharedData.diagram.zoom(.5);
        break;
      }
      case this.connector_id: {
        this.sharedData.diagram.drawingObject = this.utils.getConnector() as unknown as ConnectorModel;
        this.sharedData.diagram.tool = DiagramTools.DrawOnce;
        break;
      }
      case this.simulate_id: {

        if (!this.sim_mode) {
          this.modalService.open(this.simulate_modal_id)
          try {
            //parse
            let reservecomps = this.utils.getDesignComponents(this.sharedData.diagram)
            this.parsed = true
            //reserve
            this.designService.reserve(reservecomps, this.file_id).pipe(finalize(() => {
              this.hide_modal_close_btn = false
            })).subscribe((data) => {
              this.reserved = true
              //config
              try {
                this.setComponentsReserveConfigs(data)
                this.configured = true
                //connections
                //set nodeid_index as it is a dependancy for getconnection,prepare diagram
                this.setNodeIdIndex()
                let connections = this.utils.getDesignConnections()
                this.designService.sendDesignConnections(connections, this.file_id)
                  .subscribe(data => {
                    this.send_connections = true
                    //prepare sim env
                    this.LocalCommService.initSocket()
                    this.LocalCommService.onEvent(SocketEvent.CONNECT).subscribe(() => {
                      this.local_connected = true
                      this.error_local_connected = false
                    })
                    this.LocalCommService.onEvent(SocketEvent.CONNECTION_ERROR).subscribe(() => {
                      this.local_connected = false
                      this.error_local_connected = true
                      // this.closeSimulationMode()
                    })

                    //socket with server to start and end sim
                    this.simComm.initSocket(this.file_id)
                    this.simComm.onEvent(SocketEvent.CONNECT).subscribe(() => {
                      this.connected = true
                      try {
                        //prepare outputs in the design
                        this.PrepareDiagramForOutput();
                        this.sim_mode = true
                        this.sharedData.changeMode(this.sim_mode)
                        this.sharedData.diagram.clearSelection();
                        this.prepared = true

                      } catch (error) {
                        this.error_prepared = true
                        this.prepared = false
                        this.simComm.close()
                      }
                    })
                    this.simComm.onEvent(SocketEvent.CONNECTION_ERROR).subscribe((data) => {
                      console.log(data)
                      this.error_connected = true
                      this.connected = false

                      //as may connection drops after starting sim show if websocket connection drops get out of simulation mode
                      if (this.sim_mode) {
                        this.closeSimulationMode();
                      } else {
                        this.simComm.close()
                      }
                    })
                  }, error => {
                    this.error_send_connections = true
                    this.send_connections = false;
                  });
              } catch (error) {
                this.configured = false
                this.error_config = true;
              }
            }, error => {
              this.reserved = false;
              this.error_reserved = true
            });
          } catch (error) {
            this.error_parsed = true
            this.hide_modal_close_btn = false
          }
        } else {
          this.closeSimulationMode()
        }
        // this.sharedData.changePortValue(true, "1", "1")
        // this.diagramService.sendCodeFiles(this.boards_code).subscribe(resp => console.log(resp));
        // let connections = this.utils.getDesignConnections(this.sharedData.diagram)
        // // this.diagramService.sendSimulationData(this.boards_code[this.sharedData.diagram.nodes[0].id]).subscribe()
        // this.diagramService.sendDesignConnections(connections).subscribe(resp => console.log(resp))
        break;
      }
      case this.reserve_id: {
        this.modalService.open(this.reserve_modal_id)
        let reservecomps;
        try {
          reservecomps = this.utils.getDesignComponents(this.sharedData.diagram)
          this.parsed = true
        } catch (error) {
          this.error_parsed = true
          this.hide_modal_close_btn = false
          break;
        }
        this.designService.reserve(reservecomps, this.file_id).pipe(finalize(() => {
          this.hide_modal_close_btn = false
        })).subscribe(data => {
          // this.status = "components reserved "
          this.reserved = true
          try {
            this.setComponentsReserveConfigs(data)
            this.configured = true
          } catch (error) {
            this.configured = false
            this.error_config = true;
          }
        }, error => {
          this.reserved = false;
          this.error_reserved = true

        })


        // alert("reserved");
        // this.sharedData.diagram.nodes[0].shape = {
        //   type: 'Image',
        //   source: "../assets/redLED_on.jpg"
        // }
        // this.sharedData.diagram.refreshDia gram()
        break;
      }
      case this.reset_id: {
        alert("board resetted")
        // this.simComm.initConnection()
        this.LocalCommService.resetBoard(this.selected_board.addInfo[addInfo_connectedComponentId])
        break;
      }
    }

  }

}