import { Component, OnInit, ViewChild } from '@angular/core';
import { PaletteModel, SymbolPaletteComponent, NodeModel, NodeConstraints, DiagramComponent, DiagramTools, BasicShapeModel, PortVisibility, PortConstraints, ShapeStyle, ShapeStyleModel, PointPortModel, StackPanel } from '@syncfusion/ej2-angular-diagrams';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { ModalService } from '../modal.service';

@Component({
  selector: 'app-custom-board',
  templateUrl: './custom-board.component.html',
  styleUrls: ['./custom-board.component.css']
})
export class CustomBoardComponent implements OnInit {
  public palettes: PaletteModel[];
  @ViewChild("sidebar") sidebar: SymbolPaletteComponent;
  @ViewChild("diagram") public diagram: DiagramComponent;
  board_node: NodeModel;
  board_props: NodeModel = {
    id: "board",
    shape: {
      shape: 'Rectangle',
      type: 'Basic',
    },
    offsetX: 300,
    offsetY: 300,
    width: 300,
    height: 300,
    annotations: [{
      content: 'board name'
    }],
    ports: [],
    style: {
      fill: "#6BA5D7",
      strokeColor: "white"
    }

  }
  private pin_number = 1

  private pin: NodeModel = {
    shape: {
      shape: 'Rectangle',
      type: 'Basic',
    },
    offsetX: 100,
    offsetY: 100,
    minHeight: 30,
    maxHeight: 30,
    minWidth: 30,
    maxWidth: 30,
    annotations: [{
      content: `pin${this.pin_number}`
    }]
  }
  private grouper_node: NodeModel //
  public board_grouper: NodeModel = {
    id: 'group',
    children: [this.board_props.id]
  }
  add_pin = "add-pin"
  save_board = "save-board"

  save_custom_board_modal_id = "custom-board-modal"
  constructor(private modalService: ModalService) { }
  ngOnInit() {
  }
  diagramCreated() {
    this.diagram.add(this.board_props)
    this.board_node = this.diagram.nodes[0]
    this.diagram.add(this.board_grouper)//add board to grouper
    this.grouper_node = this.diagram.nodes[1]
  }

  fileInputChange(event) {
    let image = event.target.files[0]
    this.diagram.clear()
  }
  public children: string[]


  addPin(x: number, y: number) {

  }
  isNodeInsideBoard(node) {
    return true
  }

  create_board() {
    // board.ports = []
    // this.board.ports = []
    let ports = []
    this.diagram.nodes.forEach(node => {
      if (node.id != "board" && node.id != "group") {
        if (this.isNodeInsideBoard(node)) {
          console.log(node.id)
          //upper left corder
          let board_corner_x = this.board_node.offsetX - this.board_node.width / 2
          let board_corner_y = this.board_node.offsetY - this.board_node.height / 2
          let x = (node.offsetX - board_corner_x) / this.board_node.width
          let y = (node.offsetY - board_corner_y) / this.board_node.height
          ports.push({
            // id: node.annotations[0].content,
            offset: {
              x: x,
              y: y
            },
            shape: 'Square',
            width: this.pin.minWidth,
            height: this.pin.minHeight,
            style: {
              fill: "#c6eec6"
            },
            visibility: PortVisibility.Visible,
            constraints: PortConstraints.InConnect | PortConstraints.OutConnect
          })
        }
      }
    })
    let board: NodeModel = JSON.parse(JSON.stringify(this.board_node));
    board.ports = ports
    return board
  }
  toolbarClick(args: ClickEventArgs) {
    switch (args.item.id) {
      case this.add_pin: {

        let node = this.diagram.add(this.pin)
        this.pin_number += 1;
        this.pin.annotations[0].content = `pin${this.pin_number}`
        this.grouper_node.children.push(node.id)
        this.diagram.refresh()

        break;
      }
      case this.save_board: {
        this.modalService.open(this.save_custom_board_modal_id)
        let board_with_ports = this.create_board()
        // this.board.ports = []
        // let ports = []
        console.log(this.diagram.nodes, this.diagram.nodes[1].annotations)
        break;
      }
    }
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