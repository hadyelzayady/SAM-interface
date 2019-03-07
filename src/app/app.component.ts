import { Component, ViewChild, EventEmitter, Output } from '@angular/core';
import { DiagramModule, DiagramComponent, ConnectorModel, PointPortModel, IConnectionChangeEventArgs, Connector, ISelectionChangeEventArgs, ContextMenuSettingsModel } from '@syncfusion/ej2-angular-diagrams';
import { ToolbarItems, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { ClickEventArgs, ToolbarComponent } from '@syncfusion/ej2-angular-navigations';
import { SharedVariablesService } from './shared-variables.service';
import { ToolBarComponent } from './tool-bar/tool-bar.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild("diagram")
  public diagram: DiagramComponent;

  @ViewChild(ToolBarComponent)
  private toolBar: ToolBarComponent;

  public contextMenuSettings: ContextMenuSettingsModel;
  title = 'SAM-interface';
  constructor(public data: SharedVariablesService) {
  }
  ngOnInit(): void {
    this.data.diagram = this.diagram;

    this.contextMenuSettings = {
      show: true,
    }
  }

  selectionChangeEvent(args: ISelectionChangeEventArgs) {
    if (args.state == "Changed") {
      this.toolBar.boardSelected(args);
    }
  }


  connectorEvent(args: IConnectionChangeEventArgs) {
    console.log(args)
    if (args.state == "Changed") {
      if ((args.newValue as { nodeId: string, portId: string }).portId == "") {
        if (args.connectorEnd === "ConnectorSourceEnd")
          args.connector.sourceDecorator = { shape: 'Arrow', style: { fill: 'Black' }, };
        else if (args.connectorEnd === "ConnectorTargetEnd")
          args.connector.targetDecorator = { shape: 'Arrow', style: { fill: 'Black' }, };
      }
      else {
        if (args.connectorEnd === "ConnectorSourceEnd")
          args.connector.sourceDecorator = { shape: 'Circle', style: { fill: 'Green' }, };
        else
          args.connector.targetDecorator = { shape: 'Circle', style: { fill: 'Green' }, };

      }
    }
  }

}
