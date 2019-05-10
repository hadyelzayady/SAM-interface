import { Component, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { PaletteModel, SymbolPaletteComponent, NodeModel, NodeConstraints, DiagramComponent, DiagramTools, BasicShapeModel, PortVisibility, PortConstraints, ShapeStyle, ShapeStyleModel, PointPortModel, StackPanel, ISelectionChangeEventArgs, IHistoryChangeArgs } from '@syncfusion/ej2-angular-diagrams';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { ModalService } from '../modal.service';
import { CustomBoardService } from '../_services/custom-board.service';
import { finalize, first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { Board } from '../_models/board';
import { SharedVariablesService } from '../_services';
import { addInfo_name, addInfo_componentId } from '../utils';
import { TouchSequence } from 'selenium-webdriver';
import { queryParams } from '@syncfusion/ej2-base';
import { WidthTable } from '@syncfusion/ej2-pdf-export';
import { BehaviorSubject } from 'rxjs';
import { CanDeactivateComponent } from '../can-deactivate/can-deactivate.component';

@Component({
  selector: 'app-custom-board',
  templateUrl: './custom-board.component.html',
  styleUrls: ['./custom-board.component.css']
})
export class CustomBoardComponent extends CanDeactivateComponent implements OnInit {

  constructor(private modalService: ModalService, private sharedData: SharedVariablesService, private customBoardService: CustomBoardService, private Activatedroute: ActivatedRoute, private router: Router) {
    super()
  }
  sub
  board_id = null

  ngOnInit() {
    // this.router.navigate(['design', file.id])
    // console.log(this.Activatedroute.queryParamMap)
    // this.sub = this.Activatedroute.params.subscribe(params => {
    //   this.board_id = params.board_id || null
    //   console.log(params)

    // })

    this.board_id = +this.Activatedroute.snapshot.queryParamMap.get('board_id') || null;
    console.log("bo:", this.board_id)
    // if (this.board_id != null) {
    //   this.customBoardService.getBoard(this.board_id).subscribe(data => {
    //     console.log(data)
    //   })
    // }

  }
  saved_design = true
  canDeactivate(): boolean {
    return this.saved_design
  }

  historyChanged(args: IHistoryChangeArgs) {
    this.saved_design = false
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.sub.unsubscribe();
  }
  public palettes: PaletteModel[];
  @ViewChild("sidebar") sidebar: SymbolPaletteComponent;
  @ViewChild("diagram") public diagram: DiagramComponent;
  board_node: NodeModel;
  board_props: NodeModel = {
    id: "board",
    offsetX: 300,
    offsetY: 300,
    width: 300,
    height: 300,
    annotations: [{
      content: 'board name'
    }],
    ports: [],
    addInfo: {
      type: "board",
      [addInfo_componentId]: null
    },
  }
  board_props_default: NodeModel = {
    id: "board",
    offsetX: 300,
    offsetY: 300,
    width: 300,
    height: 300,
    annotations: [{
      content: 'board name'
    }],
    ports: [],
    addInfo: {
      type: "board",
      [addInfo_componentId]: null
    },
  }
  private pin_number = 1

  private pin: NodeModel = {
    shape: {
      shape: 'Rectangle',
      type: 'Basic',
    },
    offsetX: 100,
    offsetY: 100,
    width: 30,
    height: 30,
    annotations: [{
      content: `pin${this.pin_number}`
    }],
    addInfo: {
      type: "pin",
      pin_type: "I/O"
    }
  }
  private grouper_node: NodeModel //
  public board_grouper: NodeModel = {
    id: 'group',
    width: this.board_props.width,
    height: this.board_props.height,
    addInfo: {
      type: "grouper"
    }
    // children: []
  }
  changePinType(event) {
    console.log(event.target.value)
    this.diagram.selectedItems.nodes[0].addInfo["pin_type"] = event.target.value
  }
  hide_pin_type = true
  isVCC = false;
  isGROUND = false;
  selectionChangeEvent(args: ISelectionChangeEventArgs) {
    if (args.state == "Changed") {
      let nodes = this.diagram.selectedItems.nodes
      if (nodes.length == 1 && nodes[0].addInfo["type"] == "pin") {
        this.hide_pin_type = false;
        if (nodes[0].addInfo["pin_type"] == "GROUND") {
          this.isGROUND = true;
          this.isVCC = false;
        }
        else if (nodes[0].addInfo["pin_type"] == "VCC") {
          this.isGROUND = false;
          this.isVCC = true;
        }
        else {
          this.isGROUND = false;
          this.isVCC = false;
        }


      }
      else {
        this.hide_pin_type = true
      }
    }
  }
  add_pin = "add-pin"
  save_board = "save-board"
  image_upload = "image-upload"
  save_custom_board_modal_id = "custom-board-modal"
  convertPortToNode(port: PointPortModel) {
    //get port offset from left corner
    let port_offsetX_denormalize = port.offset.x * this.board_node.width
    let port_offsety_denormalize = port.offset.y * this.board_node.height
    let board_corner_x = this.board_node.offsetX - this.board_node.width / 2
    let board_corner_y = this.board_node.offsetY - this.board_node.height / 2
    //add port comes from server ,port offset is relative to board so we make the port relative to the diagram
    let x = board_corner_x + port_offsetX_denormalize
    let y = board_corner_y + port_offsety_denormalize
    //
    let pin_type = port.addInfo ? port.addInfo["pin_type"] : "I/O"
    let pin: NodeModel = {
      id: port.id,
      shape: {
        shape: 'Rectangle',
        type: 'Basic',
      },
      offsetX: x,
      offsetY: y,
      width: port.width,
      height: port.height,
      annotations: [{
        content: port.id
      }],
      addInfo: {
        type: "pin",
        pin_type: pin_type
      }
    };
    return pin;
  }
  diagramCreated() {
    // this.diagram.add(this.board_props)
    // this.board_node = this.diagram.nodes[0]
    // this.diagram.add(this.board_grouper)//add board to grouper
    // this.grouper_node = this.diagram.nodes[0]
    if (this.board_id != null) {
      //show already existing board
      this.customBoardService.getBoard(this.board_id).subscribe(data => {
        //add board
        this.board_props.shape = {
          type: "Image",
          source: this.sharedData.imageUrl + this.board_id + "/image"
        };
        this.board_props.annotations[0].content = data.name
        this.board_props.addInfo[addInfo_componentId] = data.id
        this.board_props.addInfo["type"] = "board"
        //set dim

        let open: EventEmitter<any> = new EventEmitter();
        var i = new Image();

        open.subscribe(dim => {
          this.board_props.width = dim["width"]
          this.board_props.height = dim["height"]
          this.new_image = true
          this.addBoard()

          data.ports.forEach(port => {
            let pin = this.diagram.add(this.convertPortToNode(port))
            this.grouper_node.children.push(pin.id)
          })
          this.diagram.refresh()
        })
        i.onload = function () {
          open.emit({ width: i.width, height: i.height })
          // image_event.next({ width: i.width, height: i.height })
          // imaged_loaded.unsubscribe()
        }
        i.src = this.board_props.shape.source
        //end set dim
        // this.addBoard()


      }, error => {
        this.router.navigate([this.router.url])
      })
    }
  }

  addBoard() {
    //add board and grouper to diagram to diagram
    console.log(this.board_props)
    console.log("add board", this.board_props.width)
    this.diagram.add(this.board_props)
    this.board_node = this.diagram.nodes[0]
    this.board_node.width = this.board_props.width
    this.board_node.height = this.board_props.height
    console.log("node width  ", this.board_node.width)
    this.board_grouper.children = [this.board_node.id]
    this.diagram.add(this.board_grouper)
    this.grouper_node = this.diagram.nodes[1]
    //add board to grouper
    this.diagram.refresh()
  }
  //after reading image file ,set the board node to this image after clearning the whole diagram
  new_image = true // if changed image then we should send the new image else just update props
  readingEnded = (e) => {
    localStorage.setItem("board", e.target.result);
    this.board_props = JSON.parse(JSON.stringify(this.board_props_default))
    this.board_props.shape = {
      type: "Image",
      source: e.target.result
    }

    let open: EventEmitter<any> = new EventEmitter();
    var i = new Image();
    open.subscribe(data => {
      this.board_props.width = data["width"]
      this.board_props.height = data["height"]
      this.board_props.ports = []
      this.new_image = true
      this.addBoard()
    })
    i.onload = function () {
      open.emit({ width: i.width, height: i.height })
      // image_event.next({ width: i.width, height: i.height })
      // imaged_loaded.unsubscribe()
    }
    i.src = e.target.result


  }


  image: File;

  fileInputChange(event) {
    this.saved_design = false
    this.image = event.target.files[0]
    if (this.image != null) {
      let reader = new FileReader()
      reader.onloadend = this.readingEnded;
      this.new_image = true
      reader.readAsDataURL(this.image)
    }

  }
  public children: string[]


  addPin(x: number, y: number) {

  }
  between(point, x1, x2, y1, y2) {
    return point.x > x1 && point.x < x2 && point.y > y1 && point.y < y2
  }
  isNodeInsideBoard(node: NodeModel) {
    //if the diagonal points inside the board then the pin is inside the board
    let pin_upper_left_x = node.offsetX - node.width / 2
    let pin_upper_left_y = node.offsetY - node.height / 2
    let pin_down_right_x = node.offsetX + node.width / 2
    let pin_down_right_y = node.offsetY + node.height / 2
    // board corners
    let minX = this.board_node.offsetX - this.board_node.width / 2 //upper left point x
    let minY = this.board_node.offsetY - this.board_node.height / 2 //upper left point y
    let maxX = this.board_node.offsetX + this.board_node.width / 2 //down right point x
    let maxY = this.board_node.offsetY + this.board_node.height / 2 //dow right point y
    console.log(pin_upper_left_x,
      pin_upper_left_y,
      pin_down_right_x,
      pin_down_right_y,
      minX,
      minY,
      maxX,
      maxY)

    return this.between({ x: pin_down_right_x, y: pin_down_right_y }, minX, maxX, minY, maxY) && this.between({ x: pin_upper_left_x, y: pin_upper_left_y }, minX, maxX, minY, maxY)
  }
  getPinOffset(board: NodeModel, pin_offset_x: number, pin_offset_y: number) {
    //upper left corder
    let board_corner_x = this.board_node.offsetX - this.board_node.width / 2
    let board_corner_y = this.board_node.offsetY - this.board_node.height / 2
    let x = (pin_offset_x - board_corner_x) / this.board_node.width
    let y = (pin_offset_y - board_corner_y) / this.board_node.height
    return [x, y]
  }

  create_board() {
    // board.ports = []
    // this.board.ports = []
    let board = { id: this.board_props.addInfo[addInfo_componentId], name: this.board_node.annotations[0].content, ports: [], code_required: true }
    let ports = []
    let pin_ids = []
    this.diagram.nodes.forEach(node => {
      if (node.id != "board" && node.id != "group") {
        if (this.isNodeInsideBoard(node)) {
          console.log(node.annotations[0].content, pin_ids)

          if (pin_ids.includes(node.annotations[0].content))
            throw Error("pins should have unique name,more than one pin have the same name")
          else
            pin_ids.push(node.annotations[0].content)
          let [x, y] = this.getPinOffset(this.board_node, node.offsetX, node.offsetY)
          ports.push({
            id: node.annotations[0].content,
            offset: {
              x: x,
              y: y
            },
            shape: 'Square',
            width: node.width,
            height: node.height,
            addInfo: {
              pin_type: node.addInfo["pin_type"]
            }
          })
        }
        else {
          throw Error("pins not inside board")
        }
      }
    })
    // let board: NodeModel = JSON.parse(JSON.stringify(this.board_node));
    board.ports = ports
    return board
  }
  hide_modal_close_btn = false;
  saved = false;
  error_saved = false
  customClose(id) {
    this.modalService.close(id)
    this.saved = false;
    this.error_saved = false
  }
  getPinInitPosition() {
    //random around center of board
    console.log("get random", this.board_node.width)
    let x = this.board_node.offsetX + Math.random() * this.board_node.width / 2
    let y = this.board_node.offsetY + Math.random() * this.board_node.height / 2
    return [x, y]
  }
  toolbarClick(args: ClickEventArgs) {
    switch (args.item.id) {
      case this.add_pin: {
        //check if first if there is board in the diagram
        if (this.diagram.getObject("board") != undefined) {
          let [x, y] = this.getPinInitPosition()
          this.pin.offsetX = x
          this.pin.offsetY = y
          let node = this.diagram.add(this.pin)
          this.pin_number += 1;
          this.pin.annotations[0].content = `pin${this.pin_number}`

          this.grouper_node.children.push(node.id)
          this.diagram.refresh()
        } else {
          alert("upload board image first")
          this.modalService.close(this.save_custom_board_modal_id)
        }
        break;
      }
      case this.save_board: {
        this.modalService.open(this.save_custom_board_modal_id)
        try {
          let board_with_ports = this.create_board()
          this.customBoardService.createCustomBoard(this.image, this.new_image, board_with_ports).pipe(finalize(() => {
            this.hide_modal_close_btn = false
          })).subscribe(data => {
            this.saved = true;
            this.error_saved = false;
            console.log("before if board id ", this.board_id)
            this.hide_modal_close_btn = false
            this.new_image = false //only true if uploaded new image
            if (this.board_id == null) {
              console.log(data.id)
              this.board_id = data.id
              this.board_node.addInfo[addInfo_componentId] = data.id
              this.router.navigate(["customboard"], { queryParams: { board_id: this.board_id } });
            }

          }, error => {
            this.saved = false;
            this.error_saved = true
          })
        } catch (error) {
          alert(error)
          this.modalService.close(this.save_custom_board_modal_id)

        }
        // this.board.ports = []
        // let ports = []
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