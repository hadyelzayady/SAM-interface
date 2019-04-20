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
import { addInfo_componentId, addInfo_reserved, addInfo_connectedComponentId } from '../utils';

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
  ngAfterViewInit(): void {

  }

  //todo merge diagram service in designservice
  constructor(public sharedData: SharedVariablesService, public utils: UtilsService, public diagramService: DiagramApiService, private designService: DesignService) {

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
  boardSelected(args: ISelectionChangeEventArgs) {
    if (this.sharedData.diagram.selectedItems.nodes.length == 1) {
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
    console.log("reserved new: ", reserved_comps)
    let cache = {}
    this.resetComponents()
    let index = 0
    this.sharedData.diagram.nodes.forEach((node, index) => {
      if (node.addInfo[addInfo_componentId] in cache) {
        let componentId = node.addInfo[addInfo_componentId];
        node.addInfo[addInfo_reserved] = true;
        node.addInfo[addInfo_connectedComponentId] = reserved_comps[cache[componentId]].id
        delete cache[componentId]
      }
      else {
        for (index; index < reserved_comps.length; index++) {
          if (node.addInfo[addInfo_componentId] == reserved_comps[index].ComponentId) {
            node.addInfo[addInfo_reserved] = true;
            node.addInfo[addInfo_connectedComponentId] = reserved_comps[index].id
            break;
          }
          else {
            cache[reserved_comps[index].ComponentId] = index
          }

        }
      }
    });

    console.log("set compoent config:", this.sharedData.diagram.nodes[1].addInfo)

  }


  //todo I receive boards id with port id ,from received map get board id in the design then get port id then change its value
  setConnectorSimValue(value: 1 | 0, board_id: string, port_id: string) {
    //todo
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
        console.log("sim")
        this.sim_mode = !this.sim_mode
        this.sharedData.diagram.clearSelection();
        this.sharedData.changeMode(this.sim_mode)
        // this.diagramService.sendCodeFiles(this.boards_code).subscribe(resp => console.log(resp));
        // let connections = this.utils.getDesignConnections(this.sharedData.diagram)
        // // this.diagramService.sendSimulationData(this.boards_code[this.sharedData.diagram.nodes[0].id]).subscribe()
        // this.diagramService.sendDesignConnections(connections).subscribe(resp => console.log(resp))
        break;
      }
      case this.reserve_id: {
        let reservecomps = this.utils.getDesignComponents(this.sharedData.diagram)
        this.designService.reserve(reservecomps, this.file_id).subscribe(data => {
          console.log("reserved", data)
          this.setComponentsReserveConfigs(data)
        }, error => {
          alert("my error" + error)
        })
        //todo update connected component id in addinfo
        console.log(reservecomps)
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

        break;
      }
    }

  }

}