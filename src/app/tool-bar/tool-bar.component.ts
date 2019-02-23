
import { Component, ViewEncapsulation, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { Button } from '@syncfusion/ej2-angular-buttons';
import { ToolbarItem } from '@syncfusion/ej2-grids';
import { cssClass } from '@syncfusion/ej2-lists';
import { AppComponent } from '../app.component';
import { SharedVariablesService } from '../shared-variables.service';
import { DiagramTools, ConnectorConstraints, ConnectorModel, NodeConstraints } from '@syncfusion/ej2-angular-diagrams';

@Component({
  selector: 'app-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ToolBarComponent {

  constructor(public sharedData: SharedVariablesService) {

  }

  undo() {
    this.sharedData.diagram.undo();
  }
  redo() {
    this.sharedData.diagram.redo();
  }
  zoom(factor: number) {
    console.log(factor)
    this.sharedData.diagram.zoom(factor);
  }
  drawConnector() {
    this.sharedData.diagram.drawingObject = {
      type: 'Orthogonal',
      constraints: ConnectorConstraints.Default | ConnectorConstraints.Bridging
    };
    this.sharedData.diagram.tool = DiagramTools.DrawOnce;
  }
}

