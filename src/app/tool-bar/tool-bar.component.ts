import { Component, ViewEncapsulation, Inject, ViewChild, AfterViewInit, Input, EventEmitter } from '@angular/core';
import { cssClass } from '@syncfusion/ej2-lists';
import { AppComponent } from '../app.component';
import { SharedVariablesService, UtilsService, DesignService } from '../_services';
import { DiagramTools, ConnectorConstraints, ConnectorModel, NodeConstraints, ISelectionChangeEventArgs, EventState, ChangeType, NodeModel, PointPortModel } from '@syncfusion/ej2-angular-diagrams';
import { ItemModel, ToolbarComponent, ClickEventArgs, Item } from '@syncfusion/ej2-angular-navigations';
import { ToolbarItem, valueAccessor } from '@syncfusion/ej2-grids';
import { InputEventArgs, UploadingEventArgs } from '@syncfusion/ej2-inputs';
import { DiagramApiService } from '../_services/diagram-api.service';
import { ReserveComponentsResponse, OutputEvent } from '../_models';
import { addInfo_componentId, addInfo_reserved, addInfo_connectedComponentId, addInfo_name, addInfo_type, ComponentType, addinfo_IP, addinfo_port, addInfo_simValue, SwitchValue, addInfo_pinType, PinType_VCC, PinType_GROUND, addInfo_isBinded, connectorDesignConstraints, UNDEFINED, addinfo_BindedPort } from '../utils';
import { ModalService } from '../modal.service';
import { finalize, takeUntil, startWith, first } from 'rxjs/operators';
import { WebSocketService } from '../_services/web-socket.service';
import { SimCommunicationService } from '../_services/sim-communication.service';
import { Led } from '../_models/Led';
import { Subject, Observable, interval } from 'rxjs';
import { SocketEvent } from '../_models/event';
import { LocalWebSocketService } from '../_services/local-web-socket.service';
import { SwitchSourceNodes } from '../_models/types';
import { nextContext } from '@angular/core/src/render3';
import { Switch } from '../_models/Switch';
import { BoardMessage } from '../_models/local_message';
import { ConfigureSamService } from '../_services/configure-sam.service';

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
  validated = false
  error_validate = false
  error_parsed = false;
  error_reserved = false;
  error_config = false;
  error_binded = false
  binded = false
  reserve_modal_id = "reserve"
  period_modal_id = "period"
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
  @ViewChild("upload_id") public upload_button: HTMLElement
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
  upload_firmware_id = "upload_id"
  fit_diagram_id = 'fitDiagram_id'
  refresh = 'refresh'
  // to unsubscribe from observables when sim ends
  private unsubscribe: Subject<void> = new Subject();

  constructor(public sharedData: SharedVariablesService, public utils: UtilsService, public diagramService: DiagramApiService, private designService: DesignService, private modalService: ModalService, private simComm: SimCommunicationService, private LocalCommService: LocalWebSocketService, private configSamService: ConfigureSamService) {

  }
  ngOnInit(): void {
    this.sharedData.currentMode.pipe(takeUntil(this.sharedData.unsubscribe_sim)).subscribe(sim_mode => {
      //console.log("sim mode change to ", sim_mode)
      this.sim_mode = sim_mode;
      this.resetToolBar()
    });
  }
  resetToolBar() {
    if (this.sim_mode) {
      this.simToolbar.hideItem(this.toggle_switch_index, true)
      this.simToolbar.hideItem(this.reset_button_index, true)
    }
    else {
      this.designToolbar.hideItem(this.upload_firmware_index, true)
    }
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
  resetToolbarToNormal() {
    this.designToolbar.hideItem(10)
  }
  created() {
    this.resetToolBar()


  }

  selected_board: NodeModel;
  toggle_id = "toggle_switch"
  reset_button_index = 4
  toggle_switch_index = 5
  upload_firmware_index = 10
  boardSelected(args: ISelectionChangeEventArgs) {
    let nodes = this.sharedData.diagram.selectedItems.nodes
    //console.log("nodes length", nodes.length)
    if (nodes.length == 1) {
      if (!this.sim_mode) {
        //normal mode
        // this.simToolbar.hideItem(5, true)//hide switch
        if (nodes[0].addInfo[addInfo_type] == ComponentType.Hardware) {
          //console.log(this.upload_button)
          this.designToolbar.hideItem(this.upload_firmware_index, false)
        }
        else {
          this.designToolbar.hideItem(this.upload_firmware_index, true)

        }
        // if (this.sharedData.diagram.selectedItems.nodes[0].id in this.boards_code) {
        //   this.selected_file = this.boards_code[this.sharedData.diagram.selectedItems.nodes[0].id].name
        // }
        // else {
        //   this.selected_file = "no code file selected"
        // }
      } else {
        //sim mode
        if (nodes[0].addInfo[addInfo_type] == ComponentType.Hardware) {
          this.selected_board = nodes[0]
          //sim mode ,show on/off reset,
          this.simToolbar.hideItem(this.reset_button_index, false) // reset button
        }
        else if (nodes[0].addInfo[addInfo_name] == Switch.name) {
          //hide other button
          this.simToolbar.hideItem(this.reset_button_index, true) // reset button
          //
          this.selected_board = nodes[0]
          this.simToolbar.hideItem(this.toggle_switch_index, false)// 
        }
      }

    }
    else {
      this.resetToolBar()
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
        let sim_value = UNDEFINED
        if (port.addInfo[addInfo_pinType] == PinType_VCC)
          sim_value = '1'
        else if (port.addInfo[addInfo_pinType] == PinType_GROUND)
          sim_value = '0'
        port.addInfo[addInfo_simValue] = sim_value
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
    //console.log("start config")
    this.sharedData.diagram.nodes.forEach((node, index) => {
      if (node.addInfo[addInfo_type] == ComponentType.Hardware) {
        if (node.addInfo[addInfo_componentId] in cache) {
          let componentId = node.addInfo[addInfo_componentId];
          node.addInfo[addInfo_reserved] = true;
          node.addInfo[addInfo_connectedComponentId] = reserved_comps[cache[componentId]].id
          node.addInfo[addinfo_IP] = reserved_comps[cache[componentId]].IP;
          node.addInfo[addinfo_port] = reserved_comps[cache[componentId]].udp_port;
          // node.annotations[0].content += "_" + node.addInfo[addinfo_IP]
          delete cache[componentId]
        }
        else {
          let found_component = false;
          for (reserved_index; reserved_index < reserved_comps.length; reserved_index++) {
            if (node.addInfo[addInfo_componentId] == reserved_comps[reserved_index].ComponentId) {
              node.addInfo[addInfo_reserved] = true;
              node.addInfo[addInfo_connectedComponentId] = reserved_comps[reserved_index].id
              node.addInfo[addinfo_IP] = reserved_comps[reserved_index].IP
              node.addInfo[addinfo_port] = reserved_comps[reserved_index].udp_port
              // node.annotations[0].content = node.addInfo[addInfo_componentId] + "_" + node.addInfo[addinfo_IP]
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
        //console.log("in for each:", connected_components_id_index)
      }
    });
    this.sharedData.diagram.dataBind()
    this.sharedData.connected_component_id_index = connected_components_id_index
    this.sharedData.nodeid_index = nodeid_index
  }

  switch_source_nodes: SwitchSourceNodes

  VCC_pins = []
  GND_pins = []
  PrepareDiagramForOutput() {
    // //console.log("table:", this.sharedData.diagram.node)
    this.switch_source_nodes = {} //contains nodes indecies that outputs to the switch
    this.sharedData.pin_inputs_bit_index = {}
    this.sharedData.pin_inputs_bit_values = {}
    let id = 0;
    this.VCC_pins = []
    this.GND_pins = []
    //console.log("nodes index", this.sharedData.nodeid_index)
    //VCC event

    this.sharedData.diagram.connectors.forEach((connector) => {
      //console.log("connector target ndoe index", connector)
      let source_node_index = this.sharedData.nodeid_index[connector.sourceID]
      let target_node_index = this.sharedData.nodeid_index[connector.targetID]
      let source_port_index = this.sharedData.diagram.nodes[source_node_index].ports.findIndex(port => { return port.id == connector.sourcePortID })
      let target_port_index = this.sharedData.diagram.nodes[target_node_index].ports.findIndex(port => { return port.id == connector.targetPortID })
      //console.log("tageti node name,", this.sharedData.diagram.nodes[target_node_index].addInfo[addInfo_name])
      let target_node = this.sharedData.diagram.nodes[target_node_index]
      let source_node = this.sharedData.diagram.nodes[source_node_index]

      //for multiple input
      this.sharedData.setPinInputBit(source_node_index, source_port_index, target_node_index, target_port_index)

      //console.log("input bit value", this.sharedData.pin_inputs_bit_values)
      // if()
      // console.log("source port", source_node.ports[source_port_index])
      if (source_node.ports[source_port_index].addInfo[addInfo_pinType] == PinType_VCC) {
        // console.log("set vc")
        this.VCC_pins.push([source_port_index, source_node_index, source_node_index, source_port_index])
      }
      if (source_node.ports[source_port_index].addInfo[addInfo_pinType] == PinType_GROUND) {
        // console.log("set GND")
        this.GND_pins.push([source_port_index, source_node_index, source_node_index, source_port_index])
      }

      if (target_node.addInfo[addInfo_name] == Led.name) {
        // console.log("led add output eetn", source_node_index, source_port_index)
        this.sharedData.addOutputEvent(source_port_index, source_node_index, target_port_index, target_node_index).pipe(takeUntil(this.unsubscribe)).subscribe((output_event) => {
          //console.log("subscribe event led target id", output_event.target_port_index, output_event.target_node_index)
          let target_node = this.sharedData.diagram.nodes[output_event.target_node_index]//target node is led node
          this.sharedData.changePortValue(output_event.value, output_event.target_port_index, output_event.target_node_index, output_event.source_node_index, output_event.source_port_index)
          let input_value = target_node.ports[output_event.target_port_index].addInfo[addInfo_simValue]
          Led.simBehaviour(input_value, target_node)
          this.sharedData.diagram.dataBind()
        }, error => {
          //console.log(error)
        })
      }
      else if (target_node.addInfo[addInfo_type] == ComponentType.Hardware && source_node.addInfo[addInfo_type] == ComponentType.Software) {
        //board has input pin from software component ,may be from switch of led input pin ,so we forward this value to the board
        //subscribe to source pin to get its value then forward it to the board
        this.sharedData.addOutputEvent(source_port_index, source_node_index, target_port_index, target_node_index).pipe(takeUntil(this.unsubscribe)).subscribe((output_event) => {
          //console.log("subscribe event board target id", output_event.target_port_index, output_event.target_node_index)
          let target_node = this.sharedData.diagram.nodes[output_event.target_node_index]
          this.boardSimBehaviour(output_event)
        }, error => {
          //console.log(error)
        })
      }
      else if (target_node.addInfo[addInfo_name] == Switch.name) {
        //if target  is switch (first pin of switch(left)) then bind source of this connector to the target of the connector of the second pin (right pin).ex: the code converts (board1_port1(src1)--> switch_left_pin(target1) ,switch_right_pin(src2)--> board2_port3(target2))  to (board1_port1){src1} --> board2_port3{target2} and condition on behave based on switch value
        //add index of src1
        //target node index is the switch index
        //so the source node to the switch is the switch value  
        // her we set the source node of switch and the following elseif sets the target node from the switch
        //**********************a new approach*************** */
        /*
          
        */
        ///***************** */
        //TODO: use array of sources instead of one source
        this.switch_source_nodes[target_node_index] = this.switch_source_nodes[target_node_index] || {}
        this.switch_source_nodes[target_node_index]["sourceNodeIndex"] = source_node_index
        this.switch_source_nodes[target_node_index]["sourcePortIndex"] = source_port_index
        this.switch_source_nodes[target_node_index]["switchInputPortIndex"] = target_port_index
        //set value of output port for switch as we bind input to it
        //init  
        let switch_output_pin_index = Math.abs(1 - target_port_index)
        this.sharedData.setPinInputBit(source_node_index, source_port_index, target_node_index, switch_output_pin_index)
        // let switch_node = this.sharedData.diagram.nodes[target_node_index]
        // let source_input_pin_node = this.sharedData.diagram.nodes[source_node_index]
        // let switch_output_port = switch_node.ports.filter(port => {
        //   return port.id != connector.targetPortID
        // })[0] || null // the switch port (src2)

      }
    })
    //console.log("switch sources target,", this.switch_source_nodes)
    // console.log("port value table,", this.sharedData.port_value_table)

    this.setSwitchSimConfigs()

    if (this.VCC_pins.length != 0) {

      interval(10000).pipe(takeUntil(this.unsubscribe), startWith(0))
        .subscribe(() => {
          // console.log("time", this.VCC_pins)
          this.VCC_pins.forEach(pin => {
            // console.log("port_index", port_index)
            // console.log("component_index", component_index)
            // console.log("port value table", this.sharedData.port_value_table)
            // source_node.ports[port_index].addInfo[addInfo_simValue] = msg.value
            //console.log("received change port", port_index)
            this.sharedData.changePortValue(true, pin[0], pin[1], pin[2], pin[3])
          })
        });
    }
    if (this.GND_pins.length != 0) {

      interval(10000).pipe(takeUntil(this.unsubscribe), startWith(0))
        .subscribe(() => {
          // // console.log("time", this.VCC_pins)
          this.GND_pins.forEach(pin => {
            // console.log("port_index", port_index)
            // console.log("component_index", component_index)
            // console.log("port value table", this.sharedData.port_value_table)
            // source_node.ports[port_index].addInfo[addInfo_simValue] = msg.value
            //console.log("received change port", port_index)
            this.sharedData.changePortValue(false, pin[0], pin[1], pin[2], pin[3])
          })
        });
    }
    // this.sharedData.ports_values.subscribe((val) => {
    //   //console.log("event in sim to chag eled")
    //   this.sharedData.diagram.nodes[0].shape = {
    //     type: 'Image',
    //     source: "../assets/redLED_on.jpg"
    //   }
    // })

  }
  boardSimBehaviour(output_event: OutputEvent) {
    let value = this.sharedData.diagram.nodes[output_event.source_node_index].ports[output_event.source_port_index].addInfo[addInfo_simValue]
    let target_board = this.sharedData.diagram.nodes[output_event.target_node_index]
    let target_pin_number = parseInt(target_board.ports[output_event.target_port_index].id)
    let IP = target_board.addInfo[addinfo_IP]
    let port = target_board.addInfo[addinfo_port]
    // console.log("send to board ", output_event.source_node_index)
    this.LocalCommService.sendToBoard(<BoardMessage>{ IP: IP, port: port, value: value, pin_id: target_pin_number })
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
    //console.log("switch_is_off", switch_is_off)
    if (switch_node.addInfo[addInfo_simValue] || switch_is_off) {
      //console.log("switch is on")
      //switch is on
      let source_port = this.sharedData.diagram.nodes[event.source_node_index].ports[event.source_port_index]
      //console.log("source_port_id,source node,source port", event.source_port_index, this.sharedData.diagram.nodes[event.source_node_index])
      //TODO: set simValue in node in changeportvalue 
      //console.log("switch is off", switch_is_off)
      let forwarded_value = !switch_is_off ? source_port.addInfo[addInfo_simValue] : false
      //this condition not needed as we will bind board pin to switch port 
      let target_node = this.sharedData.diagram.nodes[event.target_node_index]

      // if (target_node.addInfo[addInfo_type] == ComponentType.Hardware) {
      //   //   //TODO: send value to the board over ip
      //   let ip= target_node.addInfo[addinfo_IP]
      //   let port= target_node.addInfo[addinfo_port]
      //   let pin_number= target_node.ports[event.target_port_index]
      //   this..sendValueToBoard(ip,port,pin_number,forwarded_value)
      //   // let switch_output_port = switch_node.ports.find((port) => {
      //   //   return port.id != switch_input_port_id
      //   // })
      //   // switch_output_port.addInfo[addInfo_simValue] = forwarded_value

      // }
      //console.log("value,target_port_id,target_node_index", forwarded_value, event.target_port_index, event.target_node_index)
      //forward this value to target port and event this change in target port
      //target port id is the id of switch port that output to target ,(switch output port)
      this.sharedData.changePortValue(forwarded_value, event.target_port_index, event.target_node_index, event.source_node_index, event.source_port_index)
      this.sharedData.diagram.dataBind()
      // 
    }
  }
  cancel()
  {
    this.modalService.close(this.period_modal_id);
  }
  
  customClose(id: string) {
    this.parsed = false;
    this.reserved = false;
    this.configured = false;
    this.error_parsed = false;
    this.error_reserved = false;
    this.error_config = false;
    this.hide_modal_close_btn = true
    this.binded = false
    this.error_binded = false
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
    console.log("send unbind")
    this.configSamService.unBindAll().subscribe(data=>{
      console.log("unbind")
      this.simComm.close()
      this.LocalCommService.close()
      // this.resetComponents()
      this.sharedData.diagram.loadDiagram(this.diagram_before_sim)
      this.sharedData.diagram.refreshDiagram()
      this.sharedData.diagram.refresh()
    },error=>{
      console.log("error"+error)
      alert("could't unbind port ,please")
      this.sharedData.diagram.loadDiagram(this.diagram_before_sim)
      this.sharedData.diagram.refreshDiagram()
      this.sharedData.diagram.refresh()
    })
    // this.unsubscribe.complete();
   
  }
  isReservedBinded() {
    for (const node of this.sharedData.diagram.nodes) {
      if (node.addInfo[addInfo_type] == ComponentType.Hardware) {
        if (node.addInfo[addInfo_isBinded] == false)
          return true //TODO: should be false but waiting till binding works fine
      }

    }
    return true;
  }
  setUnBindAll() {
    Object.keys(this.sharedData.connected_component_id_index).forEach(connected_component_id => {
      this.sharedData.diagram.nodes[this.sharedData.connected_component_id_index[connected_component_id]].addInfo[addInfo_isBinded] = false
    })
  }
  diagram_before_sim = null
  period=30;
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
      case this.refresh: {
        this.sharedData.diagram.refresh()
        break
      }

      // case this.connector_id: {
      //   // this.sharedData.diagram.drawingObject = this.utils.getConnector() as unknown as ConnectorModel;
      //   // this.sharedData.diagram.tool = DiagramTools.DrawOnce;
      //   break;
      // }
      case this.fit_diagram_id: {
        console.log("fit diagram")
        this.sharedData.diagram.fitToPage()

        break;
      }
      case this.simulate_id: {
        //TODO: what about bind in reserve
        if (!this.sim_mode) {
          this.modalService.open(this.simulate_modal_id)
          //parse
          this.configSamService.getUserIP().subscribe(data => {
            try {
              this.diagram_before_sim = this.sharedData.diagram.saveDiagram()
              this.sharedData.ip = data["ip"]
              this.sharedData.port = data["port"]
              // console.log(this.sharedData.port)
              this.parsed = true
              //reserve
              this.designService.getReservedComponents(this.file_id).pipe(finalize(() => {
                this.hide_modal_close_btn = false
              })).subscribe((reserved_components) => {
                this.reserved = true
                //config
                try {
                  let count = this.utils.getDesignHWComponentsCount(this.sharedData.diagram)
                  let isBinded = this.isReservedBinded()
                  // // console.log("simulate", isBinded, count, reserved_components)
                  if (reserved_components.length != count || !isBinded) {
                    throw Error("re-reserve")
                  }
                  this.setComponentsReserveConfigs(reserved_components)
                  this.configured = true
                  this.error_config = false
                  //connections
                  //set nodeid_index as it is a dependancy for getconnection,prepare diagram
                  this.setNodeIdIndex()
                  try {
                    this.validate()
                    this.validated = true
                    this.error_validate = false
                    let connections = this.utils.getDesignConnections()
                    this.designService.sendDesignConnections(connections, this.file_id)
                      .subscribe(data => {
                        this.send_connections = true
                        //prepare sim env
                        this.startSockets()
                        //TODO: wait for start simulaion in websocket
                      }, error => {
                        this.error_send_connections = true
                        this.send_connections = false;
                      });
                  } catch (error) {
                    // console.log('tr', error)
                    this.validated = false
                    this.error_validate = true

                  }
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
          }, error => {
            alert("please open tray application")
            this.hide_modal_close_btn = false
          })

        } else {
          this.closeSimulationMode()
        }
        // this.sharedData.changePortValue(true, "1", "1")
        // this.diagramService.sendCodeFiles(this.boards_code).subscribe(resp => //console.log(resp));
        // let connections = this.utils.getDesignConnections(this.sharedData.diagram)
        // // this.diagramService.sendSimulationData(this.boards_code[this.sharedData.diagram.nodes[0].id]).subscribe()
        // this.diagramService.sendDesignConnections(connections).subscribe(resp => //console.log(resp))
        break;
      }
      case this.reserve_id: {
        this.modalService.open(this.period_modal_id);
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
          //console.log("toggle switch value", switch_value)
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
  reserve()
  {
    console.log(this.period)
    if(this.period==null || this.period <30 )
      return;
    this.modalService.close(this.period_modal_id)
    this.modalService.open(this.reserve_modal_id)
    let reservecomps;
    try {
      reservecomps = this.utils.getDesignComponents(this.sharedData.diagram)
      this.parsed = true
    } catch (error) {
      this.error_parsed = true
      this.hide_modal_close_btn = false
     return;
    }
    this.designService.reserve(reservecomps, this.period,this.file_id).pipe(finalize(() => {
      this.hide_modal_close_btn = false
    })).subscribe(reserved_comps => {
      // this.status = "components reserved "
      this.reserved = true
      this.error_reserved = false
      // console.log("reserveing", reserved_comps)
      // try {
      //   this.simComm.initSocket(this.file_id, "bind")
      //   // this.simComm.bindBoards(this.file_id)
      //   this.simComm.onEvent(SocketEvent.CONNECTION_ERROR).subscribe(() => {
      //     // console.log("bind fail")

      //     //TODO:
      //     this.designService.unreserve(this.file_id).subscribe((data) => {
      //       alert(data)

      //     }, error => {
      //       alert(error)
      //     })
      //     this.simComm.close()
      //     this.error_binded = true
      //     this.binded = false
      //   })
      //   this.simComm.onEvent(SocketEvent.BIND_FAIL).subscribe(() => {
      //     // console.log("bind fail")

      //     //TODO:
      //     this.designService.unreserve(this.file_id).subscribe((data) => {
      //       alert(data)

      //     }, error => {
      //       alert(error)
      //     })
      //     this.simComm.close()
      //     this.error_binded = true
      //     this.binded = false
      //   })
      //   this.simComm.onEvent(SocketEvent.BIND_SUCCESS).subscribe(() => {
      //     // console.log("bind succkes")

      //     try {
      //       console.log("after bind")

      //       this.configSamService.unBindAll().subscribe(() => {
      //           this.binded = false
      //           this.error_binded = true
      //           console.log("unbind all sent")
      //           let binded_count = 0
      //           reserved_comps.forEach((comp, index) => {
      //             // console.log("usb ip port", comp.usb_ip_port)

      //             console.log("FUCKCKKCCCK", comp)
      //             this.configSamService.sendBindIPPort(comp.IP, comp.usb_ip_port, comp).subscribe(data => {
      //               let reserved_board = data.board
      //               console.log("send bind io ", data, reserved_board)
      //               if (data.ok != "ok") {
      //                 alert("can not bind to local port")
      //               } else {
      //                 let mythis=this
      //                 setTimeout(function(){
      //                   mythis.configSamService.checkPort(reserved_board).subscribe(HW_ports => {
      //                     console.log("HW ports",HW_ports)
      //                     let resboard= HW_ports.board
      //                     let board = mythis.sharedData.diagram.nodes[mythis.sharedData.connected_component_id_index[resboard.id]]
      //                     board.addInfo[addInfo_isBinded] = true
      //                     board.annotations[0].content=board.id + "_" + HW_ports.res[0]
      //                     binded_count++
      //                     if (index == reserved_comps.length - 1) {
      //                       console.log("binded count,reserved count", binded_count, reserved_comps.length)
      //                       if (binded_count == reserved_comps.length) {
      //                         allBindedEvent.emit()
      //                       } else {
      //                         NoBindedEvent.emit()
      //                       }
      //                     }
      //                   }, error => {
      //                     console.log(error)
      //                     this.error_binded = false
      //                     this.binded = true
  
      //                     alert("can not bind")
      //                   })
      //                 },3000)
                      
      //               }
      //             }, error => {
      //               //error in sendbindipport
      //               console.log("error i  sendip poirt", error)
      //               this.error_binded = true
      //                 this.binded = false
      //               this.designService.unreserve(this.file_id).subscribe((data) => {
      //               }, error => {

      //               })

      //             })

      //           });
      //       },error=>{
      //         console.log("DMT",error)
      //       })
      //       this.setComponentsReserveConfigs(reserved_comps)
      //       let allBindedEvent = new EventEmitter()
      //       allBindedEvent.pipe(first()).subscribe(() => {
      //         this.error_binded = false
      //         this.binded = true
      //         try {
      //           this.configured = true
      //           this.error_config = false
      //         } catch (error) {
      //           this.configured = false
      //           this.error_config = true;
      //         }
      //         allBindedEvent.unsubscribe()
      //       })
      //       let NoBindedEvent = new EventEmitter()
      //       NoBindedEvent.pipe(first()).subscribe(() => {
      //         this.error_binded = true
      //         this.binded = false
      //         this.setUnBindAll()
      //         this.configSamService.unBindAll().subscribe(data=>{
      //           console.log("unbind all in no binded event")
      //         },error=>{
      //           console.log("Error unbind all in no binded event",error)

      //         })
      //         this.designService.unreserve(this.file_id).subscribe((data) => {
      //         }, error => {

      //         })
      //         NoBindedEvent.unsubscribe()
      //       })




      //     } catch (error) {

      //     }
      //     this.simComm.close()
      //   })

      // } catch (error) {
      //   //console.log("in try catch", error)
      //   //error binding
      // }
    }, error => {
      console.log(error)
      this.reserved = false;
      this.error_reserved = true

    })


    // alert("reserved");
    // this.sharedData.diagram.nodes[0].shape = {
    //   type: 'Image',
    //   source: "../assets/redLED_on.jpg"
    // }
    // this.sharedData.diagram.refreshDia gram()
  }
  validate() {
    let is_pin_O: { [board_id: string]: { [pin_id: string]: boolean } } = {} // this pin is output true ,input false
    let pin_connector: { [board_id: string]: { [pin_id: string]: number } } = {}// number is connector index
    let i = 0
    for (const connector of this.sharedData.diagram.connectors) {
      //init some data for later use
      pin_connector[connector.sourceID] = pin_connector[connector.sourceID] || {}
      pin_connector[connector.sourceID][connector.sourcePortID] = i
      pin_connector[connector.targetID] = pin_connector[connector.targetID] || {}
      pin_connector[connector.targetID][connector.targetPortID] = i
      i++
      //
      if (connector.sourceID == "" || connector.targetID == "")
        throw Error("float wire")
      //no connector target is connected to pin that has connector source == no output pin has input
      //=no two output pins connected together
      let board_id = connector.sourceID
      //if new target is in is_pin_O with true value ,or new source is in is_pin_O with false value
      is_pin_O[connector.targetID] = is_pin_O[connector.targetID] || { [connector.targetPortID]: false }
      is_pin_O[connector.sourceID] = is_pin_O[connector.sourceID] || { [connector.sourceID]: true }
      // if (is_pin_O[connector.targetID][connector.targetPortID] || !is_pin_O[connector.sourceID][connector.sourcePortID]) {
      //   throw Error("output pin can not take input")
      // }
      // end valdate no output pin has input 
      //validate no ground connected to VCC
      // console.log(this.sharedData.diagram.nodes[this.sharedData.nodeid_index[connector.sourceID]], this.sharedData.nodeid_index[connector.sourceID])
      // let source_port = this.sharedData.diagram.nodes[this.sharedData.nodeid_index[connector.sourceID]].ports.find(port => { return port.id == connector.sourcePortID })
      // let target_port = this.sharedData.diagram.nodes[this.sharedData.nodeid_index[connector.targetPortID]].ports.find(port => { return port.id == connector.targetPortID })
      // if ((source_port.addInfo[addInfo_pinType] == PinType_VCC && target_port.addInfo[addInfo_pinType] == PinType_GROUND) || target_port.addInfo[addInfo_pinType] == PinType_VCC && source_port.addInfo[addInfo_pinType] == PinType_GROUND) {
      //   throw Error("VCC is connected to Ground!")
      // }
      //end validate no ground connected to VCC
      // no inpurt to VCC
      let target_port = this.sharedData.diagram.nodes[this.sharedData.nodeid_index[connector.targetID]].ports.find(port => { return port.id == connector.targetPortID })
      if (target_port.addInfo[addInfo_pinType] == PinType_VCC || target_port.addInfo[addInfo_pinType] == PinType_GROUND)
        throw Error("VCC and GROUND should be output pins")
      //no input to ground

    }
    //validate leds
    // let leds = this.sharedData.diagram.nodes.filter(node => {
    //   return node.addInfo[addInfo_name] == Led.name
    // })
    // for (const led_node of leds) {
    //   let pin1_connector = this.sharedData.diagram.connectors[pin_connector[led_node.id][led_node.ports[0].id]]
    //   let pin2_connector = this.sharedData.diagram.connectors[pin_connector[led_node.id][led_node.ports[1].id]]
    //   let pin1_target_port = this.sharedData.diagram.nodes[this.sharedData.nodeid_index[pin1_connector.targetID]].ports.find(port => { return port.id == pin1_connector.targetPortID })
    //   let pin2_target_port = this.sharedData.diagram.nodes[this.sharedData.nodeid_index[pin2_connector.targetID]].ports.find(port => { return port.id == pin2_connector.targetPortID })
    //   if (pin1_target_port.addInfo[addInfo_pinType] ==  ) {

    //   }
    // }
    //end validate leds

    return true
  }
  startSockets() {
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

    this.LocalCommService.onMessage().subscribe(msg => {
      //console.log("received mesage", msg)
      //console.log(this.sharedData.connected_component_id_index)
      // let component_index = this.sharledData.connected_component_id_index[msg.connected_component_id]
      // let source_node = this.sharedData.diagram.nodes[component_index]
      // let port_index = source_node.ports.findIndex(port => {
      //   return port.id == "" + msg.port_id
      // })
      msg.forEach(([pin_number, value]) => {

        // console.log("gloab map", this.utils.globalPinId_boardid_portid)
        let mapping = this.utils.globalPinId_boardid_portid[pin_number]
        //console.log("mapping, msg value", mapping, msg.value)
        let component_index = mapping.component_index
        let port_index = mapping.port_index
        if (port_index > -1) {

          // console.log("port_index", port_index)
          // console.log("component_index", component_index)
          // console.log("port value table", this.sharedData.port_value_table)
          // source_node.ports[port_index].addInfo[addInfo_simValue] = msg.value
          //console.log("received change port", port_index)
          this.sharedData.changePortValue(value, port_index, component_index, component_index, port_index)
        }
      })
    })
    this.LocalCommService.onEvent(SocketEvent.DISCONNECT).subscribe(() => {
      if (this.sim_mode) {
        this.closeSimulationMode()
      }
      alert("local socket disconnected")
    })

    //socket with server to start and end sim
    try {
      //prepare outputs in the design
      this.PrepareDiagramForOutput();
      this.sim_mode = true
      this.sharedData.changeMode(true)
      this.modalService.close(this.simulate_modal_id)
      this.sharedData.diagram.clearSelection();
      this.prepared = true
      this.simComm.initSocket(this.file_id)
      this.simComm.onEvent(SocketEvent.SUCCESSFULL).subscribe(() => {
        this.connected = true
        this.error_connected = false
      })
      this.simComm.onEvent(SocketEvent.DISCONNECT).subscribe(() => {
        this.closeSimulationMode()
      })
      this.simComm.onEvent(SocketEvent.CONNECTION_ERROR).subscribe((data) => {
        //console.log(data)
        this.error_connected = true
        this.connected = false

        //as may connection drops after starting sim show if websocket connection drops get out of simulation mode
        // if (this.sim_mode) {
        this.closeSimulationMode();
        // } else {
        // this.simComm.close()
        // }
      })
      this.simComm.onEvent(SocketEvent.BoardStartedSimulation).subscribe((connected_component_id) => {
        console.log("stoped")
        this.sharedData.diagram.nodes[this.sharedData.connected_component_id_index[connected_component_id]].style = {
          fill: "green"
        }
      })
      this.simComm.onEvent(SocketEvent.BOARD_NOT_START_SIM).subscribe((coonected_component_id) => {
        //console.log(data)
        this.sharedData.diagram.nodes[this.sharedData.connected_component_id_index[coonected_component_id]].style = {
          fill: "red"
        }
        //as may connection drops after starting sim show if websocket connection drops get out of simulation mode
        // if (this.sim_mode) {
        // } else {
        // this.simComm.close()
        // }
      })

    } catch (error) {
      //console.log("error in prepare diagram ", error)
      this.error_prepared = true
      this.prepared = false
      this.simComm.close()
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
    //use bits so each suscriber has the index of its bit in switch port, in each event or the bits of the pin to get the value of the pin
    //console.log("set old value: ", source_node_index, switch_node, source_port_index, switch_output_port_index)
    this.switchSimBehaviour({ source_node_index: source_node_index, target_node_index: switch_node_index, target_port_index: switch_output_port_index, value: true, source_port_index: source_port_index }, !isOn)// value not used in switch so choose anything
    // let sources_ports=
    //if no on then switch is turned off so we send 0 to all output pin connected to switch ouptut pin
  }
}