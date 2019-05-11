import { Component, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { PaletteModel, SymbolPaletteComponent, NodeModel, NodeConstraints, DiagramComponent, DiagramTools, BasicShapeModel, PortVisibility, PortConstraints, ShapeStyle, ShapeStyleModel, PointPortModel, StackPanel, ISelectionChangeEventArgs, IHistoryChangeArgs, ITextEditEventArgs, CommandManager } from '@syncfusion/ej2-angular-diagrams';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { ModalService } from '../modal.service';
import { CustomBoardService } from '../_services/custom-board.service';
import { finalize, first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { Board } from '../_models/board';
import { SharedVariablesService } from '../_services';
import { addInfo_name, addInfo_componentId } from '../utils';
import { TouchSequence } from 'selenium-webdriver';
import { queryParams, select } from '@syncfusion/ej2-base';
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
  board_name_regex = /^[A-Za-z][a-zA-Z0-9]*$/
  board_id = null
  map_table_rows_count = 10
  SAM_pins = Array(8)
  public commandManager: CommandManager;
  ngOnInit() {
    // this.router.navigate(['design', file.id])
    // console.log(this.Activatedroute.queryParamMap)
    // this.sub = this.Activatedroute.params.subscribe(params => {
    //   this.board_id = params.board_id || null
    //   console.log(params)

    // })

    this.board_id = +this.Activatedroute.snapshot.queryParamMap.get('board_id') || null;
    console.log("bo:", this.SAM_pins)

    this.setCommandManager()

    //init sampin_boardPin for table to show none always
    this.resetTable()
    // if (this.board_id != null) {
    //   this.customBoardService.getBoard(this.board_id).subscribe(data => {
    //     console.log(data)
    //   })
    // }

  }
  myPaste(pin) {
    //also sets default pin configuration
    this.pin.annotations[0].content = `pin${this.pin_number}`
    this.pin.width = pin["width"]
    this.pin.height = pin["height"]
    this.pin.offsetX = pin["offsetX"] + .5 * pin["width"]
    this.pin.offsetY = pin["offsetY"] + .5 * pin["height"]
    let node = this.diagram.add(this.pin)
    this.pin_number += 1;
    this.grouper_node.children.push(node.id)
    this.diagram.dataBind()
  }
  setCommandManager() {
    let diagram = this.diagram
    let resetTable = this.resetTable
    let mythis = this
    this.diagram.commandManager = {
      commands: [
        {
          name: 'copy',
          canExecute: function () {
            console.log("canExecute", diagram.selectedItems.nodes)
            if (diagram.selectedItems.nodes.length == 1 && diagram.selectedItems.nodes[0].addInfo["type"] == "pin")
              return true;
            return false
          },
          execute: (): void => {
            let node = diagram.copy()
            mythis.myPaste(node[0])
          },
        },

        {
          name: 'cut',
          canExecute: function () {
            console.log("canExecute", diagram.selectedItems.nodes)
            if (diagram.selectedItems.nodes.length == 1 && diagram.selectedItems.nodes[0].addInfo["type"] == "pin")
              return true;
            return false
          },

        },
        {
          name: 'paste',
          canExecute: function () {
            return false
          },

        },
        {
          name: 'delete',
          execute: function () {
            if (diagram.selectedItems.nodes.length == 1 && diagram.selectedItems.nodes[0].addInfo["type"] != "pin") {
              // diagram.removeNode(mythis.board_node)
              if (confirm("are you sure all changed will be removed")) {
                diagram.clear()
                mythis.resetTable()
              }
              else { }
            }
          }
        },
        {
          name: "undo",
          canExecute: () => {
            return false
          }
        },
        {
          name: "redo",
          canExecute: () => {
            return false
          }
        }


      ]
    }
  }
  resetTable() {
    for (let index = 0; index < this.SAM_pins.length; index++) {
      this.SAMPin_BoardPin[index] = ""
    }
    this.boardPin_selected = {}
    this.BoardPin_SAMPin = {}
  }
  saved_design = true
  canDeactivate(): boolean {
    return this.saved_design
  }

  historyChanged(args) {
    // if(args.change)
    this.saved_design = false
    let isRemove = args.change["Remove"] || false
    let isInsert = args.change["Insert"] || false
    let isPropertyChaned = args.change["type"] == "PropertyChanged" || false
    if (isRemove) {
      let source = args.source
      source.forEach(node => {
        let board_pin = node.annotations[0].content
        let sam_pin = this.BoardPin_SAMPin[board_pin]
        this.SAMPin_BoardPin[sam_pin] = ""
        delete this.BoardPin_SAMPin[board_pin]
      })
    }
    else if (isPropertyChaned) {
      //check if board name not matched to regex
      console.log("source 0", args.source[0])
      //!board has key 0 in nodes ,but sure if t works all the time
      if (args.source[0].nodes[0] != undefined) {
        let annotations = args.source[0]["nodes"][0]["annotations"] || null
        if (annotations != null) {
          console.log("annotaionts", annotations[0].id)
          //shoudl use this in below condition annotations["id"] == "boardname" && but id is not set!
          if (!this.board_name_regex.test(annotations[0].content)) {
            alert("invalid name")
            this.board_node.annotations[0].content = this.board_props_default.annotations[0].content
            return;
          } else {
            this.board_props_default.annotations[0].content = annotations[0].content
          }
        }
      }

    }
    console.log(args)
    console.log(isRemove)
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
      content: 'board name',
    }],
    ports: [],
    addInfo: {
      type: "board",
      [addInfo_componentId]: null
    },
    zIndex: -1

  }
  board_props_default: NodeModel = {
    id: "board",
    offsetX: 300,
    offsetY: 300,
    width: 300,
    height: 300,
    annotations: [{
      content: 'boardname',
      width: 100,
      height: 100
    }],
    ports: [],
    addInfo: {
      type: "board",
      [addInfo_componentId]: null,
      selected: false
    },
    zIndex: -1

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
    },
    zIndex: 50
  }
  private grouper_node: NodeModel //
  public board_grouper: NodeModel = {
    id: 'group',
    width: this.board_props.width,
    height: this.board_props.height,
    addInfo: {
      type: "grouper"
    },
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
  getPins() {
    return this.diagram.nodes.filter(node => {
      return node.addInfo["type"] == "pin"
    })
  }

  boardPin_selected: { [key: string]: boolean } = {}
  PinSelectedEvent(sam_pin_index, pin_id: string) {
    console.log("change sele", sam_pin_index)
    if (pin_id == "") {
      console.log("pin is null")
      let oldBoardPin_id = this.SAMPin_BoardPin[sam_pin_index] || null
      console.log("old pin_id", oldBoardPin_id)
      if (oldBoardPin_id != null) {
        delete this.BoardPin_SAMPin[sam_pin_index]
        this.boardPin_selected[oldBoardPin_id] = false
      }
      this.SAMPin_BoardPin[sam_pin_index] = ''
      console.log(this.SAMPin_BoardPin[sam_pin_index])
      // this.SAMPin_BoardPin[sam_pin_index] = "none"
    }
    else {
      this.BoardPin_SAMPin[pin_id] = sam_pin_index
      this.boardPin_selected[pin_id] = true
      this.SAMPin_BoardPin[sam_pin_index] = pin_id

    }
    console.log(this.boardPin_selected, this.SAMPin_BoardPin)
  }
  add_pin = "add-pin"
  save_board = "save-board"
  image_upload = "image-upload"
  save_custom_board_modal_id = "custom-board-modal"
  convertPortToNode(port: PointPortModel, pinmap) {
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
      shape: {
        shape: 'Rectangle',
        type: 'Basic',
      },
      offsetX: x,
      offsetY: y,
      width: port.width,
      height: port.height,
      annotations: [{
        content: pinmap[port.id]
      }],
      addInfo: {
        type: "pin",
        pin_type: pin_type
      }
    };
    return pin;
  }
  initTable(pin_map: { [key: string]: string }) {
    //set pins map
    Object.keys(pin_map).forEach(sam_pin => {
      this.SAMPin_BoardPin[sam_pin] = pin_map[sam_pin]
      this.BoardPin_SAMPin[pin_map[sam_pin]] = parseInt(sam_pin)
      this.boardPin_selected[pin_map[sam_pin]] = true
    })
    //set
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
        console.log(data.pin_map)
        //set dim

        let open: EventEmitter<any> = new EventEmitter();
        var i = new Image();

        open.subscribe(dim => {
          this.board_props.width = dim["width"]
          this.board_props.height = dim["height"]
          // this.new_image = true
          this.addBoard()

          data.ports.forEach(port => {
            let pin = this.diagram.add(this.convertPortToNode(port, data.pin_map))
            this.grouper_node.children.push(pin.id)
            this.pin_number += 1
          })
          this.initTable(data.pin_map)
          this.diagram.refreshDiagram()
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

    // this.board_node.width = this.board_props.width
    // this.board_node.height = this.board_props.height
    console.log("node width  ", this.board_node.width)
    this.board_grouper.children = [this.board_node.id]
    this.diagram.add(this.board_grouper)
    this.grouper_node = this.diagram.nodes[1]
    //add board to grouper
    this.diagram.dataBind()
    this.diagram.refreshDiagram()
  }
  //after reading image file ,set the board node to this image after clearning the whole diagram
  // new_image = true // if changed image then we should send the new image else just update props
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
      // this.new_image = true
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
    // this.diagram.nodes = []
    // this.diagram.removeNode(this.board_node) // this more convenient to remove only the board and keep pins
    this.diagram.clear()
    this.resetTable()
    if (this.image != null) {
      let reader = new FileReader()
      reader.onloadend = this.readingEnded;
      // this.new_image = true
      reader.readAsDataURL(this.image)
    }

  }
  public children: string[]


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
  BoardPin_SAMPin: { [key: string]: number } = {}
  SAMPin_BoardPin: Array<string> = []


  create_board() {
    // board.ports = []
    // this.board.ports = []
    console.log(this.board_node)
    let board = { id: this.board_id, name: this.board_node.annotations[0].content, ports: [], code_required: true }
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
          let pin_id = node.annotations[0].content
          let SAM_pin = this.BoardPin_SAMPin[pin_id]
          if (SAM_pin == null)
            throw Error("SAM pin map not assigned")
          let [x, y] = this.getPinOffset(this.board_node, node.offsetX, node.offsetY)
          ports.push({
            id: this.BoardPin_SAMPin[pin_id],
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
    if (!this.board_name_regex.test(this.board_node.annotations[0].content))
      throw Error("name should start with letter then containt only letter or digits or _ ")
    return board
  }
  EditBoardNameEvent(args: ITextEditEventArgs) {

    // args.newValue
  }
  hide_modal_close_btn = false;
  saved = false;
  error_saved = false
  customClose(id) {
    this.modalService.close(id)
    this.saved = false;
    this.error_saved = false
    this.error_message = null
  }

  getPinInitPosition() {
    //random around center of board
    console.log("get random", this.board_node.width)
    let x = this.board_node.offsetX //+ Math.random() * this.board_node.width / 2
    let y = this.board_node.offsetY //+ Math.random() * this.board_node.height / 2
    return [x, y]
  }
  error_message = null

  checkAllPinMapped() {
    console.log("board pn sele", this.boardPin_selected)
    return Object.keys(this.boardPin_selected).filter(pin_id => {
      return this.boardPin_selected[pin_id] == true
    }).length
      == this.diagram.nodes.filter(node => {
        return node.addInfo["type"] == "pin"
      }).length
  }
  getSAMMapping() {
    let map = {}
    this.SAMPin_BoardPin.forEach((board_pin, sam_pin) => {
      if (board_pin != "")
        map["" + sam_pin] = board_pin
    })
    return map
  }
  toolbarClick(args: ClickEventArgs) {
    switch (args.item.id) {
      case this.add_pin: {
        //check if first if there is board in the diagram
        if (this.diagram.getObject("board") != undefined) {
          let [x, y] = this.getPinInitPosition()
          this.pin.offsetX = x
          this.pin.offsetY = y
          this.pin.annotations[0].content = `pin${this.pin_number}`
          let node = this.diagram.add(this.pin)
          this.pin_number += 1;

          this.grouper_node.children.push(node.id)
          this.diagram.refresh()
        } else {
          alert("upload board image first")
          this.modalService.close(this.save_custom_board_modal_id)
        }
        break;
      }
      case this.save_board: {
        console.log("boardpin sampin:", this.BoardPin_SAMPin)
        if (!this.checkAllPinMapped()) {
          alert("please set mapping pins for each pin in board to SAM pin number")
        } else {
          this.modalService.open(this.save_custom_board_modal_id)
          try {

            let board_with_ports = this.create_board()
            let sam_maps = this.getSAMMapping()
            console.log("sent board", board_with_ports)
            this.customBoardService.createCustomBoard(this.image, board_with_ports, sam_maps).pipe(finalize(() => {
              this.hide_modal_close_btn = false
            })).subscribe(data => {
              this.saved = true;
              this.error_saved = false;
              this.saved_design = true
              console.log("before if board id ", this.board_id)
              this.hide_modal_close_btn = false
              // this.new_image = false //only true if uploaded new image
              if (this.board_id == null) {
                console.log(data.id)
                this.board_id = data.id
                this.board_node.addInfo[addInfo_componentId] = data.id
                this.router.navigate(["customboard"], { queryParams: { board_id: this.board_id } });
              }

            }, error => {
              this.saved = false;
              this.error_saved = true
              this.error_message = error
            })


          } catch (error) {
            alert(error)
            this.modalService.close(this.save_custom_board_modal_id)

          }
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