import { Component, ViewEncapsulation, Inject, ViewChild, AfterViewInit, Input } from '@angular/core';
import { cssClass } from '@syncfusion/ej2-lists';
import { AppComponent } from '../app.component';
import { SharedVariablesService, UtilsService, DesignService } from '../_services';
import { DiagramTools, ConnectorConstraints, ConnectorModel, NodeConstraints, ISelectionChangeEventArgs, EventState, ChangeType, NodeModel, PointPortModel } from '@syncfusion/ej2-angular-diagrams';
import { ItemModel, ToolbarComponent, ClickEventArgs, Item } from '@syncfusion/ej2-angular-navigations';
import { ToolbarItem, valueAccessor } from '@syncfusion/ej2-grids';
import { InputEventArgs, UploadingEventArgs } from '@syncfusion/ej2-inputs';
import { DiagramApiService } from '../_services/diagram-api.service';
import { ReserveComponentsResponse, OutputEvent } from '../_models';
import { addInfo_componentId, addInfo_reserved, addInfo_connectedComponentId, addInfo_name, addInfo_type, ComponentType, addinfo_IP, addinfo_port, addInfo_simValue, SwitchValue } from '../utils';
import { ModalService } from '../modal.service';
import { finalize, takeUntil } from 'rxjs/operators';
import { WebSocketService } from '../_services/web-socket.service';
import { SimCommunicationService } from '../_services/sim-communication.service';
import { Led } from '../_models/Led';
import { Subject } from 'rxjs';
import { SocketEvent } from '../_models/event';
import { LocalWebSocketService } from '../_services/local-web-socket.service';
import { SwitchSourceNodes } from '../_models/types';
import { nextContext } from '@angular/core/src/render3';
import { Switch } from '../_models/Switch';

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
  ngOnInit(): void {
    this.sharedData.currentMode.pipe(takeUntil(this.sharedData.unsubscribe_sim)).subscribe(sim_mode => {
      console.log("sim mode change to ", sim_mode)
      this.sim_mode = sim_mode;
      this.setOneBoardActionButtonsVisibility(false)
    });
  }
  fileInputChange(event) {
    let board_id = this.sharedData.diagram.selectedItems.nodes[0].id
    let file = event.target.files[0]
    this.boards_code[board_id] = file
    this.selected_file = file.name
  }
  setOneBoardActionButtonsVisibility(visibility: boolean) {
    if (this.simToolbar.items.length > 4)
      this.simToolbar.hideItem(4, !visibility)
  }


  selected_board: NodeModel;
  toggle_id = "toggle_switch"
  boardSelected(args: ISelectionChangeEventArgs) {
    let nodes = this.sharedData.diagram.selectedItems.nodes
    if (nodes.length == 1) {
      if (!this.sim_mode) {
        this.simToolbar.hideItem(5, true)//hide switch
        this.hide_fileupload = false;
        if (this.sharedData.diagram.selectedItems.nodes[0].id in this.boards_code) {
          this.selected_file = this.boards_code[this.sharedData.diagram.selectedItems.nodes[0].id].name
        }
        else {
          this.selected_file = "no code file selected"
        }
      } else {
        if (nodes[0].addInfo[addInfo_type] == ComponentType.Hardware) {
          this.selected_board = nodes[0]
          //sim mode ,show on/off reset,
          this.simToolbar.hideItem(5, true)

          this.setOneBoardActionButtonsVisibility(true)
        }
        else if (nodes[0].addInfo[addInfo_name] == Switch.name) {
          this.selected_board = nodes[0]
          this.setOneBoardActionButtonsVisibility(false)
          this.simToolbar.hideItem(5, false)
        }
        else {
          this.setOneBoardActionButtonsVisibility(false)
          this.simToolbar.hideItem(5, true)


        }


      }

    }
    else {
      this.hide_fileupload = true;
      this.setOneBoardActionButtonsVisibility(false)
      this.simToolbar.hideItem(5, true)

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
      if (node.addInfo[addInfo_name] == Led.name) {
        node.shape = Led.shape
      } else if (node.addInfo[addInfo_name] == Switch.name) {
        Switch.Toggle(node, false)
      } else
        node.addInfo[addInfo_reserved] = false

      node.addInfo[addInfo_simValue] = false
      node.ports.forEach(port => {
        port.addInfo[addInfo_simValue] = false
      })
    })


    this.sharedData.diagram.dataBind()
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
          node.addInfo[addinfo_IP] = reserved_comps[cache[componentId]].IP;
          node.addInfo[addinfo_port] = reserved_comps[cache[componentId]].port;
          delete cache[componentId]
        }
        else {
          let found_component = false;
          for (reserved_index; reserved_index < reserved_comps.length; reserved_index++) {
            if (node.addInfo[addInfo_componentId] == reserved_comps[reserved_index].ComponentId) {
              node.addInfo[addInfo_reserved] = true;
              node.addInfo[addInfo_connectedComponentId] = reserved_comps[reserved_index].id
              node.addInfo[addinfo_IP] = reserved_comps[reserved_index].IP
              node.addInfo[addinfo_port] = reserved_comps[reserved_index].port
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
  switch_source_nodes: SwitchSourceNodes
  //TODO: get reserved boards on loading design to save them in the table
  PrepareDiagramForOutput() {
    //TODO: should be merged with getconnections
    // console.log("table:", this.sharedData.diagram.node)
    this.switch_source_nodes = {} //contains nodes indecies that outputs to the switch
    this.sharedData.diagram.connectors.forEach((connector) => {
      let source_node_index = this.sharedData.nodeid_index[connector.sourceID]
      let target_node_index = this.sharedData.nodeid_index[connector.targetID]
      let source_port_index = this.sharedData.diagram.nodes[source_node_index].ports.findIndex(port => { return port.id == connector.sourcePortID })
      let target_port_index = this.sharedData.diagram.nodes[target_node_index].ports.findIndex(port => { return port.id == connector.targetPortID })
      //TODO: if board pin is input from switch we should bind event from switch output pin to send the value
      console.log("tageti node name,", this.sharedData.diagram.nodes[target_node_index].addInfo[addInfo_name])
      if (this.sharedData.diagram.nodes[target_node_index].addInfo[addInfo_name] == Led.name) {

        this.sharedData.addOutputEvent(source_port_index, source_node_index, target_port_index, target_node_index).pipe(takeUntil(this.unsubscribe)).subscribe((output_event) => {
          console.log("subscribe event led target id", output_event.target_port_index, output_event.target_node_index)
          let target_node = this.sharedData.diagram.nodes[output_event.target_node_index]
          Led.simBehaviour(output_event.value, target_node)
          this.sharedData.diagram.dataBind()
        }, error => {
          console.log(error)
        })
      }
      else if (this.sharedData.diagram.nodes[target_node_index].addInfo[addInfo_name] == Switch.name) {
        //if target  is switch (first pin of switch(left)) then bind source of this connector to the target of the connector of the second pin (right pin).ex: the code converts (board1_port1(src1)--> switch_left_pin(target1) ,switch_right_pin(src2)--> board2_port3(target2))  to (board1_port1){src1} --> board2_port3{target2} and condition on behave based on switch value
        //add index of src1
        //target node index is the switch index
        //so the source node to the switch is the switch value  
        // her we set the source node of switch and the following elseif sets the target node from the switch
        //**********************a new approach*************** */
        /*
          
        */
        ///***************** */
        this.switch_source_nodes[target_node_index] = this.switch_source_nodes[target_node_index] || {}
        this.switch_source_nodes[target_node_index]["sourceNodeIndex"] = source_node_index
        this.switch_source_nodes[target_node_index]["sourcePortIndex"] = source_port_index
        this.switch_source_nodes[target_node_index]["switchInputPortIndex"] = target_port_index
        // let switch_node = this.sharedData.diagram.nodes[target_node_index]
        // let source_input_pin_node = this.sharedData.diagram.nodes[source_node_index]
        // let switch_output_port = switch_node.ports.filter(port => {
        //   return port.id != connector.targetPortID
        // })[0] || null // the switch port (src2)

      }
    })
    console.log("switch sources target,", this.switch_source_nodes)
    console.log("port value table,", this.sharedData.port_value_table)
    this.setSwitchSimConfigs()
    // this.sharedData.ports_values.subscribe((val) => {
    //   console.log("event in sim to chag eled")
    //   this.sharedData.diagram.nodes[0].shape = {
    //     type: 'Image',
    //     source: "../assets/redLED_on.jpg"
    //   }
    // })

  }

  setSwitchSimConfigs() {
    Object.keys(this.switch_source_nodes).forEach(switch_node_index => {
      let switch_index = parseInt(switch_node_index)
      let switch_props = this.switch_source_nodes[switch_index]
      let switch_node = this.sharedData.diagram.nodes[switch_index]
      let source_node_index = switch_props["sourceNodeIndex"]
      let source_port_index = switch_props["sourcePortIndex"]
      let switch_input_port_index = switch_props["switchInputPortIndex"]
      let switch_output_port_index = Math.abs(1 - switch_input_port_index)
      //bind source node port of switch input to output port if the switch
      this.sharedData.addOutputEvent(source_port_index, source_node_index, switch_output_port_index, switch_index).pipe(takeUntil(this.unsubscribe)).subscribe((event: OutputEvent) => {
        this.switchSimBehaviour(event)
      })
    })
  }

  getValueFromSource(source_node_index) {

  }
  switchSimBehaviour(event: OutputEvent, switch_is_off = false) {
    let switch_node = this.sharedData.diagram.nodes[event.target_node_index] //switch node
    //switsh_is_off is true only when user turns off the switch
    console.log("switch_is_off", switch_is_off)
    if (switch_node.addInfo[addInfo_simValue] || switch_is_off) {
      console.log("switch is on")
      //switch is on
      let source_port = this.sharedData.diagram.nodes[event.source_node_index].ports[event.source_port_index]
      console.log("source_port_id,source node,source port", event.source_port_index, this.sharedData.diagram.nodes[event.source_node_index])
      //TODO: set simValue in node in changeportvalue 
      console.log("switch is off", switch_is_off)
      let forwarded_value = !switch_is_off ? source_port.addInfo[addInfo_simValue] : false
      //this condition not needed as we will bind board pin to switch port 
      // if (target_node.addInfo[addInfo_type] == ComponentType.Hardware) {
      //   //TODO: send value to the board over ip
      // let switch_output_port = switch_node.ports.find((port) => {
      //   return port.id != switch_input_port_id
      // })
      // switch_output_port.addInfo[addInfo_simValue] = forwarded_value

      // } else {
      console.log("value,target_port_id,target_node_index", forwarded_value, event.target_port_index, event.target_node_index)
      //forward this value to target port and event this change in target port
      //target port id is the id of switch port that output to target ,(switch output port)
      this.sharedData.changePortValue(forwarded_value, event.target_port_index, event.target_node_index)
      this.sharedData.diagram.dataBind()
      // 

    }
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
  resetLeds() {

  }
  closeSimulationMode() {

    this.sharedData.changeMode(false)
    this.unsubscribe.next()
    this.unsubscribe.complete();
    this.simComm.close()
    this.LocalCommService.close()
    this.resetComponents()
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
                      this.closeSimulationMode()
                    })

                    //socket with server to start and end sim

                    this.simComm.initSocket(this.file_id)
                    this.simComm.onEvent(SocketEvent.SUCCESSFULL).subscribe(() => {
                      this.connected = true
                      this.error_connected = false
                      try {
                        //prepare outputs in the design
                        this.PrepareDiagramForOutput();
                        this.sim_mode = true
                        this.sharedData.changeMode(true)
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
                      // if (this.sim_mode) {
                      this.closeSimulationMode();
                      // } else {
                      // this.simComm.close()
                      // }
                    })
                    //TODO: wait for start simulaion in websocket
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
        // alert("board resetted")
        // this.simComm.initConnection()
        this.LocalCommService.resetBoard(this.selected_board.addInfo[addinfo_IP], this.selected_board.addInfo[addinfo_port])
        break;
      }
      case this.toggle_id: {
        // alert("board resetted")
        // this.simComm.initConnection()
        if (this.selected_board.addInfo[addInfo_name] == Switch.name) {
          Switch.Toggle(this.selected_board)
          let switch_value = this.selected_board.addInfo[addInfo_simValue]
          console.log("toggle switch value", switch_value)
          this.fireSwitchTogglesEvent(switch_value)
          // if (switch_value) {
          //   //switch is on, change its port values
          //   //get values of all ports that is binded to this switch
          //   //then change the port value by oring all values
          //   // fireSwitchTogglesEvent(switch)

          // } else {
          //   //switch is now off,change its ports to false
          //   //!if led is connected to two switches ,if one of them turned to off ,the led will be off as the fired event will change it

          // }

        }



        // this.sharedData.changePortValue()
        break;
      }
    }

  }

  fireSwitchTogglesEvent(isOn: boolean) {
    let switch_node = this.selected_board
    let switch_pin1_id = switch_node.ports[0].id
    let switch_pin2_id = switch_node.ports[1].id
    //
    let switch_node_index = this.sharedData.nodeid_index[switch_node.id]
    let switch_props = this.switch_source_nodes[switch_node_index]
    let source_node_index: number = switch_props["sourceNodeIndex"]
    let source_port_index = switch_props["sourcePortIndex"]
    let switch_input_port_index = switch_props["switchInputPortIndex"]
    let switch_output_port_index = Math.abs(1 - switch_input_port_index)
    //TODO: bind input pin of switch to source pin
    //TODO: bind output pin of switch to multiple source pins (use array)
    //TODO: use bits so each suscriber has the index of its bit in switch port, in each event or the bits of the pin to get the value of the pin
    console.log("set old value: ", source_node_index, switch_node, source_port_index)
    this.switchSimBehaviour({ source_node_index: source_node_index, target_node_index: switch_node_index, target_port_index: switch_output_port_index, value: true, source_port_index: source_port_index }, !isOn)// value not used in switch so choose anything
    // let sources_ports=
    //if no on then switch is turned off so we send 0 to all output pin connected to switch ouptut pin
  }
}