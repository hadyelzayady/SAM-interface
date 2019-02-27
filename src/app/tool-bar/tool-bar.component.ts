
import { Component, ViewEncapsulation, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { cssClass } from '@syncfusion/ej2-lists';
import { AppComponent } from '../app.component';
import { SharedVariablesService } from '../shared-variables.service';
import { DiagramTools, ConnectorConstraints, ConnectorModel, NodeConstraints, ISelectionChangeEventArgs, EventState, ChangeType } from '@syncfusion/ej2-angular-diagrams';
import { UtilsService } from '../utils.service';
import { ItemModel, ToolbarComponent, ClickEventArgs } from '@syncfusion/ej2-angular-navigations';

@Component({
  selector: 'app-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ToolBarComponent {
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

  single_selection_items: ItemModel[] = [
    { id: 'upload code', text: 'upload code', tooltipText: 'upload board code file', prefixIcon: 'e-collapse', align: 'Right' }

  ];

  constructor(public sharedData: SharedVariablesService, public utils: UtilsService) {

  }
  ngOnInit(): void {
    this.toolbar.items = this.fixed_items;

  }
  boardSelected(selected_count: number) {
    if (selected_count == 1) {
      if (!this.single_selection_mode) {
        this.toolbar.addItems(this.single_selection_items);
        this.single_selection_mode = true;
      }
    }
    else {
      this.toolbar.items = this.fixed_items
      this.single_selection_mode = false;

    }

  }

  toolbarClick(args: ClickEventArgs): void {
    switch (args.item.id) {
      case this.undo_id: {
        console.log("undo")
        this.sharedData.diagram.undo();
        break;
      }
      case this.redo_id: {
        this.sharedData.diagram.redo();
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
      case this.connector_id: { }
        this.sharedData.diagram.drawingObject = this.utils.getConnector();
        this.sharedData.diagram.tool = DiagramTools.DrawOnce;
    }
  }

}

