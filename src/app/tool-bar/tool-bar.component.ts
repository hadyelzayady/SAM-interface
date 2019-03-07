
import { Component, ViewEncapsulation, Inject, ViewChild, AfterViewInit, Input } from '@angular/core';
import { cssClass } from '@syncfusion/ej2-lists';
import { AppComponent } from '../app.component';
import { SharedVariablesService } from '../shared-variables.service';
import { DiagramTools, ConnectorConstraints, ConnectorModel, NodeConstraints, ISelectionChangeEventArgs, EventState, ChangeType } from '@syncfusion/ej2-angular-diagrams';
import { UtilsService } from '../utils.service';
import { ItemModel, ToolbarComponent, ClickEventArgs, Item } from '@syncfusion/ej2-angular-navigations';
import { ToolbarItem } from '@syncfusion/ej2-grids';
import { InputEventArgs, UploadingEventArgs } from '@syncfusion/ej2-inputs';

@Component({
  selector: 'app-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ToolBarComponent {

  boards_code: { [key: string]: File; } = {};
  hide_fileupload = true;
  file = null
  selected_file = "no code file selected"
  @ViewChild("toolbar") public toolbar: ToolbarComponent;
  @ViewChild("fileinput") public fileupload_element: HTMLInputElement;
  undo_id = "undo"
  redo_id = "redo"
  zoomin_id = "zoomin"
  zoomout_id = "zoomout"
  connector_id = "connector"
  fileupload_id = 'fileupload'

  single_selection_mode = false;
  file_input: ItemModel = {
    id: this.fileupload_id, type: "Input", template: `<div class="form-group" >
      <input type="file"
             id="file">
      </div>`, htmlAttributes: { "hidden": "true" }
  }
  items: ItemModel[] = [
    { id: this.undo_id, tooltipText: 'Undo', prefixIcon: 'e-undo-icon' },
    { id: this.redo_id, tooltipText: 'Redo', prefixIcon: 'e-redo-icon', },
    { type: 'Separator' },
    { id: this.zoomin_id, tooltipText: 'Zoom In', prefixIcon: 'e-zoomin-icon' },
    { id: this.zoomout_id, tooltipText: 'Zoom Out', prefixIcon: 'e-zoomout-icon' },
    { type: 'Separator' },
    { id: this.connector_id, tooltipText: 'draw connector', prefixIcon: 'e-zoomout-icon' },
    ,
    this.file_input

  ]
  ngAfterViewInit(): void {

  }

  constructor(public sharedData: SharedVariablesService, public utils: UtilsService) {

  }
  ngOnInit(): void {
    // this.toolbar.items = this.items;


  }
  readingEnded = (e) => {
    console.log(e.target.result)

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
      // let index = this.items.indexOf(this.file_input)
      // this.toolbar.hideItem(index, false)
      if (this.sharedData.diagram.selectedItems.nodes[0].id in this.boards_code) {
        console.log("inside")
        this.selected_file = this.boards_code[this.sharedData.diagram.selectedItems.nodes[0].id].name
      }
      else {
        this.selected_file = "no code file selected"
      }

    }
    else {
      // let index = this.items.indexOf(this.file_input)
      // this.toolbar.hideItem(index, true)
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
    }

  }

}

