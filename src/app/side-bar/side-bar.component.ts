import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PaletteModel, NodeModel, ConnectorModel, PointPortModel, PortVisibility, NodeConstraints, PortConstraints } from '@syncfusion/ej2-angular-diagrams';
import { Arduino } from '../models/arduino';
@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  // styleUrls: ['./side-bar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SideBarComponent implements OnInit {
  public palettes: PaletteModel[];
  public getBoards(): NodeModel[] {
    console.log(new Arduino())
    let boards: NodeModel[] = [new Arduino().toJSON()];
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
      }
    },
    {
      id: 'Link21',
      type: 'Straight',
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
    ]
  }

}
