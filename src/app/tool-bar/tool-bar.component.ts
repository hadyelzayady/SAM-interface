import { Component, ViewEncapsulation, Inject, ViewChild, AfterViewInit, Input } from '@angular/core';
import { cssClass } from '@syncfusion/ej2-lists';
import { AppComponent } from '../app.component';
import { SharedVariablesService } from '../shared-variables.service';
import { DiagramTools, ConnectorConstraints, ConnectorModel, NodeConstraints, ISelectionChangeEventArgs, EventState, ChangeType } from '@syncfusion/ej2-angular-diagrams';
import { UtilsService } from '../utils.service';
import { ItemModel, ToolbarComponent, ClickEventArgs, Item } from '@syncfusion/ej2-angular-navigations';
import { ToolbarItem } from '@syncfusion/ej2-grids';
import { InputEventArgs, UploadingEventArgs } from '@syncfusion/ej2-inputs';
import { DiagramApiService } from '../diagram-api.service';

@Component({
  selector: 'app-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ToolBarComponent {

  boards_code: { [key: string]: File; } = {};
  hide_fileupload = true;
  selected_file = "no code file selected"
  @ViewChild("toolbar") public toolbar: ToolbarComponent;
  undo_id = "undo"
  redo_id = "redo"
  zoomin_id = "zoomin"
  zoomout_id = "zoomout"
  connector_id = "connector"
  fileupload_id = 'fileupload'
  simulate_id = "simulate"
  ngAfterViewInit(): void {

  }

  constructor(public sharedData: SharedVariablesService, public utils: UtilsService, public diagramService: DiagramApiService) {

  }

  fileInputChange(event) {
    console.log("input change ")
    let board_id = this.sharedData.diagram.selectedItems.nodes[0].id
    let file = event.target.files[0]
    this.boards_code[board_id] = file
    this.selected_file = file.name
  }
  boardSelected(args: ISelectionChangeEventArgs) {
    if (this.sharedData.diagram.selectedItems.nodes.length == 1) {
      this.hide_fileupload = false;
      if (this.sharedData.diagram.selectedItems.nodes[0].id in this.boards_code) {
        this.selected_file = this.boards_code[this.sharedData.diagram.selectedItems.nodes[0].id].name
      }
      else {
        this.selected_file = "no code file selected"
      }

    }
    else {
      this.hide_fileupload = true;

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
        this.sharedData.diagram.drawingObject = this.utils.getConnector();
        this.sharedData.diagram.tool = DiagramTools.DrawOnce;
      }
      case this.simulate_id: {
        console.log("sim")
        // let connections = this.utils.makeConnections(this.sharedData.diagram)

        this.diagramService.sendSimulationData(this.boards_code[this.sharedData.diagram.nodes[0].id])
      }
    }

  }

}