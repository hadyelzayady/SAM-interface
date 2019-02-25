import { Component, ViewChild } from '@angular/core';
import { DiagramModule, DiagramComponent, ConnectorModel, PointPortModel, IConnectionChangeEventArgs, Connector } from '@syncfusion/ej2-angular-diagrams';
import { ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { SharedVariablesService } from './shared-variables.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild("diagram")
  public diagram: DiagramComponent;
  title = 'SAM-interface';
  constructor(public data: SharedVariablesService) {
  }
  ngOnInit(): void {
    this.data.diagram = this.diagram;
    // this.diagram.connectionChange = (args) => {
    //   console.log(args);
    // }
  }

  connectorEvent(args: IConnectionChangeEventArgs) {
    console.log(args)
    if (args.state == "Changed") {
      if (args.newValue.portId == "") {
        if (args.connectorEnd === "ConnectorSourceEnd")
          args.connector.sourceDecorator = { shape: 'Arrow', style: { fill: 'Black' }, };
        else if (args.connectorEnd === "ConnectorTargetEnd")
          args.connector.targetDecorator = { shape: 'Arrow', style: { fill: 'Black' }, };
      }
      else {
        if (args.connectorEnd === "ConnectorSourceEnd")
          args.connector.sourceDecorator = { shape: 'Circle', style: { fill: 'Green' }, };
        else if (args.connectorEnd === "ConnectorTargetEnd")
          args.connector.targetDecorator = { shape: 'Circle', style: { fill: 'Green' }, };

      }
    }
  }
  drop(args) {
  }
  clickHandler(args: ClickEventArgs): void {
    if (args.item.id === "load") {
      let x = localStorage.getItem('fileName');
      this.diagram.loadDiagram(x);
    }
    else if (args.item.id === "save") {
      let x = this.diagram.saveDiagram();
      localStorage.setItem('fileName', x);
    }
  }
}
