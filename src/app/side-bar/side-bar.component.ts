import { Component, OnInit, ViewEncapsulation, ViewChild, EventEmitter } from '@angular/core';
import { PaletteModel, NodeModel, ConnectorModel, PointPortModel, PortVisibility, NodeConstraints, PortConstraints, SymbolPaletteComponent } from '@syncfusion/ej2-angular-diagrams';
import { Arduino } from '../_models/arduino';
import { Battery } from '../_models/Battery';
import { Led } from '../_models/Led';
import { SharedVariablesService, DesignService } from '../_services';
import { Board } from '../_models/board';
import { finalize, takeUntil, first } from 'rxjs/operators';
import { nodeDesignConstraints, connectorDesignConstraints, addInfo_componentId } from '../utils';
import { Components } from '../_models/Components';
import { BehaviorSubject } from 'rxjs';
import { Switch } from '../_models/Switch';
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



  public getSimulaionComponents(): NodeModel[] {
    let boards: NodeModel[] = [Led.getObj(), Switch.getObj()];
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
        x: 30,
        y: 30
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
    this.sharedData.currentMode.pipe(takeUntil(this.sharedData.unsubscribe_sim)).subscribe(sim_mode => {
      this.sim_mode = sim_mode;
      if (sim_mode) {
        // // console.log("sim,", sim_mode)
        this.sidebar.allowDrag = false
      }
      else if (this.palettes) {
        this.sidebar.allowDrag = true
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
        id: 'user-boards',
        expanded: true,
        title: 'User Boards'
      },
      {
        id: 'connectors',
        expanded: true,
        symbols: this.getConnectors(),
        title: 'Connectors',
        iconCss: 'e-ddb-icons e-connector'
      },
      {
        id: 'Simulation-components',
        expanded: true,
        symbols: this.getSimulaionComponents(),
        title: 'Simulation Components',
        iconCss: 'e-ddb-icons e-basic',
      }
    ];

    this.designService.getSideBarItems().pipe(
      finalize(() => {
        //Action to be executed always after subscribe
        this.sidebar.palettes = this.palettes
      }
      )).subscribe(([builtin_boards, user_boards]) => {
        // this.boards = this.parseBoards(data["boards"])
        // // console.log(builtin_boards, user_boards)
        this.builtin_boards = builtin_boards
        this.user_boards = user_boards
        this.setBoards()

      }, error => {
        console.log(error)
        alert("error in loading sidebar items")
      });
  }

  addBoardsToPallete() {
    this.sidebar.palettes[0].symbols = this.builtin_boards
    this.sidebar.palettes[1].symbols = this.user_boards
    this.sidebar.refresh()

  }
  builtin_boards = []
  user_boards = []
  setImage(board: NodeModel, type_index: number) {
    this.designService.getImage(board.addInfo[addInfo_componentId]).subscribe(image => {
      let open: EventEmitter<any> = new EventEmitter();

      open.pipe(first()).subscribe(() => {
        //check if all boards have image setted to add these boards to pallete
        this.added_count += 1
        if (this.added_count == this.total_boards_count)
          this.addBoardsToPallete()
      })

      let reader = new FileReader();
      reader.onloadend = (e) => {
        board.shape["source"] = e.target["result"]
        open.emit()
      }

      reader.readAsDataURL(image)
    }, error => {
      this.added_count += 1
      // // console.log("error in getting image", error)
    })
  }

  total_boards_count = 0;
  added_count = 0
  setBoards() {
    this.total_boards_count = this.builtin_boards.length + this.user_boards.length;
    this.added_count = 0
    this.builtin_boards.forEach(board => {
      this.setImage(board, 0)
    })
    this.user_boards.forEach(board => {
      this.setImage(board, 1)
    })
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
