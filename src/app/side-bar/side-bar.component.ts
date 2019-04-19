import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { PaletteModel, NodeModel, ConnectorModel, PointPortModel, PortVisibility, NodeConstraints, PortConstraints, SymbolPaletteComponent } from '@syncfusion/ej2-angular-diagrams';
import { Arduino } from '../_models/arduino';
import { Battery } from '../_models/Battery';
import { Led } from '../_models/Led';
import { SharedVariablesService, DesignService } from '../_services';
import { Board } from '../_models/board';
import { finalize } from 'rxjs/operators';
import { nodeDesignConstraints, connectorDesignConstraints } from '../utils';
import { Components } from '../_models/Components';
@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  // styleUrls: ['./side-bar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SideBarComponent implements OnInit {
  public palettes: PaletteModel[];
  private sim_mode = false;
  boards: NodeModel[];

  @ViewChild("sidebar") sidebar: SymbolPaletteComponent;

  constructor(private sharedData: SharedVariablesService, private designService: DesignService) { }



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
      },
    },
    ];
    return connectorSymbols;
  };


  ngOnInit(): void {
    this.sharedData.currentMode.subscribe(sim_mode => {
      this.sim_mode = sim_mode;
      if (sim_mode) {
        // this.sidebar.palettes = [{}]
        console.log("sim,", sim_mode)
        // this.sidebar.allowDrag = false
        this.sidebar.symbolTable = {}
        // this.sidebar.refresh()
      }
      else if (this.palettes) {
        this.sidebar.palettes = this.palettes
        // this.sidebar.allowDrag = true;
        // this.sidebar.width = 0
        // this.sidebar.refresh()
      }


    });
    this.palettes = [

      {
        id: 'boards',
        expanded: true,
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
    ];


    this.designService.getSideBarItems().pipe(
      finalize(() => {
        //Action to be executed always after subscribe
        this.sidebar.palettes = this.palettes
      }
      )).subscribe(data => {
        //todo: needs optimization as we can set properties of boards as default values but how?
        // this.boards = this.parseBoards(data["boards"])
        this.palettes[0].symbols = data

      }, error => {
        alert("error in loading sidebar items")
      });
  }

  parseBoards(boards: NodeModel[]): NodeModel[] {
    boards.forEach(board => {
      board.constraints = nodeDesignConstraints,
        board.ports.forEach(port => {
          port.constraints = connectorDesignConstraints;
          port.visibility = PortVisibility.Visible;
        })
    });
    return boards;
  }
}
