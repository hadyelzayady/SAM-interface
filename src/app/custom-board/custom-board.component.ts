import { Component, OnInit, ViewChild } from '@angular/core';
import { PaletteModel, SymbolPaletteComponent, NodeModel, NodeConstraints, DiagramComponent, DiagramTools, BasicShapeModel, PortVisibility, PortConstraints, ShapeStyle, ShapeStyleModel, PointPortModel } from '@syncfusion/ej2-angular-diagrams';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';

@Component({
  selector: 'app-custom-board',
  templateUrl: './custom-board.component.html',
  styleUrls: ['./custom-board.component.css']
})
export class CustomBoardComponent implements OnInit {
  public palettes: PaletteModel[];
  @ViewChild("sidebar") sidebar: SymbolPaletteComponent;
  @ViewChild("diagram") public diagram: DiagramComponent;
  board: NodeModel
  constructor() { }
  add_pin = "add-pin"
  save_pin = "save-pin"
  public shape: BasicShapeModel = {
    type: 'Basic',
    shape: 'Rectangle',

  }
  public style: ShapeStyleModel = {
    fill: "#6BA5D7",
    strokeColor: "white"
  }
  ngOnInit() {
  }
  addPin(x: number, y: number) {

  }
  isNodeInsideBoard(node) {
    return true
  }
  toolbarClick(args: ClickEventArgs) {
    switch (args.item.id) {
      case this.add_pin: {
        this.diagram.drawingObject = {
          id: "pin",
          shape: {
            shape: 'Rectangle',
            type: 'Basic',
          },
          minHeight: 5,
          maxHeight: 30,
          minWidth: 5,
          maxWidth: 30,

        },
          this.diagram.tool = DiagramTools.DrawOnce;
        break;
      }
      case this.save_pin: {
        this.board.ports = []
        let ports = []
        this.diagram.nodes.forEach(node => {
          if (node.id != "board") {
            if (this.isNodeInsideBoard(node)) {
              //upper left corder
              let board_corner_x = this.board.offsetX - this.board.width / 2
              let board_corner_y = this.board.offsetY - this.board.height / 2
              let x = (node.offsetX - board_corner_x) / this.board.width
              let y = (node.offsetY - board_corner_y) / this.board.height
              console.log(this.board.offsetX, node.offsetX, x, y)
              ports.push({
                id: "pin1",
                offset: {
                  x: x,
                  y: y
                },
                style: {
                  fill: "#c6eec6"
                },
                visibility: PortVisibility.Visible,
                constraints: PortConstraints.InConnect | PortConstraints.OutConnect
              })
            }
          }
        })
        this.board.ports = ports;

        this.diagram.refresh()

      }
    }
  }
  diagramCreated() {
    this.board = this.diagram.nodes[0]

  }



}


// this.diagram.drawingObject = {
//   id: "1",
//   shape: {
//     shape: 'Rectangle',
//     type: 'Basic',
//   },
//   minHeight: 5,
//   maxHeight: 30,
//   minWidth: 5,
//   maxWidth: 30,

// },
//   this.diagram.tool = DiagramTools.DrawOnce;