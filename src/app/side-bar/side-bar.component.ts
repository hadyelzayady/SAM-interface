import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PaletteModel, NodeModel, ConnectorModel, PointPortModel, PortVisibility, NodeConstraints, PortConstraints } from '@syncfusion/ej2-angular-diagrams';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  // styleUrls: ['./side-bar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SideBarComponent implements OnInit {

  public palettes: PaletteModel[];
  public getBoards(): NodeModel[] {
    let boardports: PointPortModel[] = [{
      offset: {
        x: 324 / 960,
        y: 33 / 680
      },
      visibility: PortVisibility.Visible,


    }];
    let boards: NodeModel[] = [{
      id: 'Arduino',
      shape: {
        type: 'Image',
        source: "../../assets/arduino.png",
      },
      constraints: ~NodeConstraints.InConnect & ~NodeConstraints.OutConnect,
      ports: boardports,

    },
    ];
    return boards;
  };
  public getFlowShapes(): NodeModel[] {
    let flowShapes: NodeModel[] = [{
      id: 'process',
      shape: {
        type: 'Flow',
        shape: 'Process'
      }
    },
    ];
    return flowShapes;
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
    this.palettes = [{
      //Sets the id of the palette
      id: 'flow',
      //Sets whether the palette expands/collapse its children
      expanded: true,
      //Adds the palette items to palette
      symbols: this.getFlowShapes(),
      //Sets the header text of the palette
      title: 'Flow Shapes',
      iconCss: 'e-ddb-icons e-flow'
    },
    {
      id: 'basic',
      expanded: true,
      symbols: this.getBoards(),
      title: 'Basic Shapes',
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
