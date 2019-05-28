import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { board } from './boards';
import { BOARDS } from './boards-mocks';
import { ConfigureSamService } from '../_services/configure-sam.service';
import { element, nextContext } from '@angular/core/src/render3';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedVariablesService } from '../_services/shared-variables.service';
import { ModalService } from '../modal.service';
import { finalize } from 'rxjs/operators';
@Component({

  selector: 'app-configure-sam',
  templateUrl: './configure-sam.component.html',
  styleUrls: ['./configure-sam.component.css']
})
export class ConfigureSamComponent implements OnInit {
  // @ViewChild("carousel_next") carousel_next:ElementRef;
  /// remember this is important
  // serverurl="thesambackend.herokuapp.com";
  serverurl = "192.168.1.30/SAM";
  boards = BOARDS;
  selectedBoard: board;

  EthernetAvailable = false;
  constructor(private configservice: ConfigureSamService, private router: Router,
    private route: ActivatedRoute, private sharedData: SharedVariablesService, private modalService: ModalService) { }
  portvarUDP: string;
  portvarUSB: string;
  wifinamevar: string;
  wifipassvar: string;
  returnUrl: string;

  ngOnInit() {
    this.configservice.getcomponents().subscribe(data => {

      // console.log("the recieved component is"+data);
      this.boards = data;

    }, error => {
      // console.log("the error is "+error);
      alert(error);

    })
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    // this.returnUrl ="http://www.google.com"
  }
  next(): void {

    let carousel_next = document.getElementById("carousel_next") as HTMLElement;
    carousel_next.click();
  }
  getversion(): any {
    this.configservice.getVersion().subscribe(data => {
      // console.log("board version is "+ data.toString());
      if (data.toString().includes("E")) {
        this.EthernetAvailable = true;
        this.next();

      }
      else {
        this.next();
      }
    }, error => {
      // console.log("the error is "+error);
      this.EthernetAvailable = true;
      this.next();
      // alert("please plugin your sam and make sure its connected and selected in the tray app");

    })

  }
  onSelect(boardx: board): void {
    this.selectedBoard = boardx;
  }
  modal_id = "add-component-modal"
  id_setted = false
  error_id = false
  server_setted = false
  error_server = false
  hello_setted = false
  error_hello_set = false
  component_added = false
  error_component = false
  hello_sent = false
  error_hello_send = false
  finish_sent = false
  error_finish = false
  hide_modal_close_btn
  customClose() {
    if (this.finish_sent)
      this.router.navigate(["home"]);
    this.id_setted = false
    this.error_id = false
    this.server_setted = false
    this.error_server = false
    this.hello_setted = false
    this.error_hello_set = false
    this.component_added = false
    this.error_component = false
    this.hello_sent = false
    this.error_hello_send = false
    this.finish_sent = false
    this.error_finish = false
    this.hide_modal_close_btn = true

  }
  setcomponent(boardid: String): void {
    // console.log("board x is with id:"+boardid);
    this.modalService.open(this.modal_id)

    this.configservice.setid(boardid).pipe(finalize(() => {
      this.hide_modal_close_btn = false
    })).subscribe(data => {
      // console.log("server is set with url:"+this.serverurl);
      this.id_setted = true
      this.configservice.setserver(this.serverurl).subscribe(data => {
        // console.log("server is set with url:"+this.serverurl);
        this.server_setted = true
        this.configservice.sethellomsg("hello_" + boardid).subscribe(data => {
          // // console.log("hellomsg is set to hello_"+boardid);
          this.hello_setted = true
          // console.log("hellomsg was sent");

          this.configservice.addcomponent(boardid, this.portvarUDP, this.portvarUSB).subscribe(data => {
            // // console.log("id is set to"+boardid);
            // this.configservice.setport(this.portvarUDP,this.portvarUSB,boardid).subscribe(data=>{
            //   console.log(data);
            this.component_added = true
            this.configservice.Sendhellomsg().subscribe(data => {
              this.hello_sent = true
              //remember this is important 
              this.configservice.sendfinish().subscribe(data => {
                this.finish_sent = true
                // console.log("finishsent");

                // },error=>{
                //   console.log("the error is "+error);
                //  console.log(error)
                // })  
              }, error => {
                console.log("the error is " + error);
                // alert(error);
                this.error_finish = true
              })

            }, error => {
              this.error_hello_send = true
              console.log("the error is " + error);
              // alert(error);

            })
          }, error => {
            console.log("the error is " + error);
            // alert(error);
            this.error_component = true

          })
        }, error => {
          console.log("the error is " + error);
          // alert(error);
          this.error_hello_set = true
        })


      }, error => {
        console.log("the error is " + error);
        // alert(error["res"]);
        this.error_server = true

      })

    }, error => {
      console.log("the error is " + error);
      // alert(error["res"]);
      this.error_id = true

    })
  }

  setport(): void {
    console.log("entered here");
    console.log(this.portvarUDP);
    console.log(this.portvarUSB);
    this.next();
  }
  // sendports():void{
  //   this.configservice.setport(this.portvarUDP,this.portvarUSB).subscribe(data=>{
  //     console.log(data);
  //     if(data["res"]=="failed")
  //     console.log("the data is failed");
  //   },error=>{
  //     console.log("the error is "+error);
  //    console.log(error)
  //   })
  // }
  getimage(boardid: String): any {
    return `${this.sharedData.imageUrl}${boardid}/image`
  }
  setwifi(): void {
    console.log("entered here");
    if (this.wifinamevar == "")
      alert("empty wifi name not allowed")
    else {

      this.configservice.setwifiname(this.wifinamevar).subscribe(data => {
        if (data["res"] == "failled")
          console.log("the data is failed");
        else {

          this.configservice.setwifipass(this.wifipassvar).subscribe(data => {
            if (data["res"] == "failled")
              alert("authnetication failed")
            else {
              let carousel_next = document.getElementById("carousel_next") as HTMLElement;
              carousel_next.click();
              console.log("the data is correct");
            }

          }, error => {
            console.log("the error is " + error);
            alert("can not connected to wifi ,may be the password is wrong");

          })


          // let carousel_next =document.getElementById("carousel_next") as HTMLElement;
          // carousel_next.click();
        }

      }, error => {
        console.log("the error is " + error);
        alert("wifi name is not correct");

      })
    }
  }
}
