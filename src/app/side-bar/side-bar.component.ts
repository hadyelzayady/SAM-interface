import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PaletteModel, NodeModel, ConnectorModel, PointPortModel, PortVisibility, NodeConstraints, PortConstraints } from '@syncfusion/ej2-angular-diagrams';
import { Arduino } from '../_models/arduino';
import { Battery } from '../_models/Battery';
import { Led } from '../_models/Led';
@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  // styleUrls: ['./side-bar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SideBarComponent implements OnInit {
  public palettes: PaletteModel[];
  public getBoards(): NodeModel[] {
    let boards: NodeModel[] = [Arduino.getObj()];
    return boards;
  };
  public getLeds(): NodeModel[] {
    let boards: NodeModel[] = [Led.getObj()];
    return boards;
  };
  public getBattery(): NodeModel[] {
    let boards: NodeModel[] = [Battery.getObj()];
    return boards;
  };

  public getConnectors(): ConnectorModel[] {
    let connectorSymbols: ConnectorModel[] = [{
      id: 'Link1',
      type: 'Orthogonal',
      sourcePoint: {
        x: 0,
        y: 0
      },
      targetPoint: {
        x: 40,
        y: 40
      },
      targetDecorator: {
        shape: 'Arrow'
      },
      sourceDecorator: {
        shape: "Circle"
      }
    },
    ];
    return connectorSymbols;
  };
  ngOnInit(): void {
    this.palettes = [

      {
        id: 'boards',
        expanded: true,
        symbols: this.getBoards(),
        title: 'Boards',
        iconCss: 'e-ddb-icons e-basic'
      },
      {
        id: 'connectors',
        expanded: true,
        symbols: this.getConnectors(),
        title: 'Connectors',
        iconCss: 'e-ddb-icons e-connector'
      }
      ,
      {
        id: 'voltage_src',
        expanded: true,
        symbols: this.getBattery(),
        title: 'Battery',
        iconCss: 'e-ddb-icons e-basic'
      }
      ,
      {
        id: 'Leds',
        expanded: true,
        symbols: this.getLeds(),
        title: 'Leds',
        iconCss: 'e-ddb-icons e-basic'
      }
    ]
  }

}
