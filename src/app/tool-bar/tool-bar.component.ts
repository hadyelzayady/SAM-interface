
import { Component, ViewEncapsulation, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { cssClass } from '@syncfusion/ej2-lists';
import { AppComponent } from '../app.component';
import { SharedVariablesService } from '../shared-variables.service';
import { DiagramTools, ConnectorConstraints, ConnectorModel, NodeConstraints, ISelectionChangeEventArgs, EventState, ChangeType } from '@syncfusion/ej2-angular-diagrams';
import { UtilsService } from '../utils.service';
import { ItemModel, ToolbarComponent, ClickEventArgs, Item } from '@syncfusion/ej2-angular-navigations';
import { Uploader } from '@syncfusion/ej2-inputs';
import { ToolbarItem } from '@syncfusion/ej2-grids';

@Component({
  selector: 'app-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ToolBarComponent {

  boards_code: { [key: string]: string; } = {};
  @ViewChild("toolbar") public toolbar: ToolbarComponent;
  undo_id = "undo"
  redo_id = "redo"
  zoomin_id = "zoomin"
  zoomout_id = "zoomout"
  connector_id = "connector"

  single_selection_mode = false;
  fixed_items: ItemModel[] = [
    { id: this.undo_id, tooltipText: 'Undo', prefixIcon: 'e-undo-icon' },
    { id: this.redo_id, tooltipText: 'Redo', prefixIcon: 'e-redo-icon', },
    { type: 'Separator' },
    { id: this.zoomin_id, tooltipText: 'Zoom In', prefixIcon: 'e-zoomin-icon' },
    { id: this.zoomout_id, tooltipText: 'Zoom Out', prefixIcon: 'e-zoomout-icon' },
    { type: 'Separator' },
    { id: this.connector_id, tooltipText: 'draw connector', prefixIcon: 'e-zoomout-icon' },

  ]


  constructor(public sharedData: SharedVariablesService, public utils: UtilsService) {

  }
  ngOnInit(): void {
    this.toolbar.items = this.fixed_items;


  }
  boardSelected(args: ISelectionChangeEventArgs) {
    if (this.sharedData.diagram.selectedItems.nodes.length == 1) {
      let file_upload_item: ItemModel =
      {
        // id: this.connector_id, tooltipText: 'draw connector', prefixIcon: 'e-zoomout-icon', type: "Input",
        template: `<div class="form-group" >
      <input type="file"
             id="file"
             onchange="handleFileInput()">
      </div>`, align: 'Right'
      };
      this.toolbar.items = this.fixed_items.concat(file_upload_item);

    }
    else {
      this.toolbar.items = this.fixed_items
    }

  }
  handleFileInput() {
    console.log("args")
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

