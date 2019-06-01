import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { board } from './boards';
import { BOARDS } from './boards-mocks';
import { ConfigureSamService } from '../_services/configure-sam.service';
import { element, nextContext } from '@angular/core/src/render3';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedVariablesService } from '../_services/shared-variables.service';
import { ModalService } from '../modal.service';
import { finalize } from 'rxjs/operators';
import { routerNgProbeToken } from '@angular/router/src/router_module';
@Component({

  selector: 'app-configure-sam',
  templateUrl: './configure-sam.component.html',
  styleUrls: ['./configure-sam.component.css']
})
export class ConfigureSamComponent implements OnInit {
  // @ViewChild("carousel_next") carousel_next:ElementRef;
  /// remember this is important
  // serverurl="thesambackend.herokuapp.com";
  serverurl = this.sharedData.domainbaseurl_without_port_http+"SAM";
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
this.wifinamevar=""
this.wifipassvar=""
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
     
      console.log("board version is "+ data.res.toString());
      if (data.res.toString().includes("E")) {
        this.EthernetAvailable = true;
        this.next();

      }
      else {
        // alert("please check that you are connected to sam and tray application is on" )
        this.next()
      }
    }, error => {
      console.log(error)
      alert("Please check that you are connected to SAM and tray application is on" )
      // console.log("the error is "+error);
      // this.EthernetAvailable = true;
      // this.next();
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
    this.modalService.close(this.modal_id)
    if (this.hello_sent){
    let carousel_next = document.getElementById("carousel_next") as HTMLElement;
    carousel_next.click();}
    else
      alert("Please try again")
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
  sendfinished():void{
    this.configservice.sendfinish().subscribe(data => {
               
      if (data.res=="0"){
      this.finish_sent = false
      this.error_finish = true
      alert("Please turn on the switch on the SAM to running mode")
}
      else {
        this.finish_sent = true
        this.router.navigate(["home"])
      }
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
  
  }
  setcomponent(boardid: String): void {
    // console.log("board x is with id:"+boardid);
    this.modalService.open(this.modal_id)

   
      this.configservice.setserver(this.serverurl).subscribe(data => {
        // console.log("server is set with url:"+this.serverurl);
        this.server_setted = true
        this.hide_modal_close_btn = false

          this.configservice.addcomponent(boardid, this.portvarUDP, this.portvarUSB).subscribe(data => {
            // // console.log("id is set to"+boardid);
            // this.configservice.setport(this.portvarUDP,this.portvarUSB,boardid).subscribe(data=>{
              console.log(data.id);
              let samboardid=data.id
            this.component_added = true
            this.configservice.setid(samboardid.toString()).subscribe(data => {
              // console.log("server is set with url:"+this.serverurl);
              this.id_setted = true
            this.configservice.sethellomsg( "q="+samboardid+"_Hello" ).subscribe(data => {
              // // console.log("hellomsg is set to hello_"+boardid);
              this.hello_setted = true
              // console.log("hellomsg was sent");
            this.configservice.Sendhellomsg().subscribe(data => {
              if (data.res=="0")
            {  this.hello_sent = false
              this.error_hello_send = true}
            else{
              this.hello_sent = true
              //remember this is important 
            }
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
      alert("Empty wifi name not allowed")
    else {
console.log(this.wifinamevar)
      this.configservice.setwifiname(this.wifinamevar).subscribe(data => {
        if (data["res"] == "failled")
          console.log("the data is failed");
        else {

if (this.wifipassvar.length>7||this.wifipassvar.length==0){
          this.configservice.setwifipass(this.wifipassvar).subscribe(data => {
            if (data["res"] == "failled")
              alert("Authnetication failed")
            else {
              let carousel_next = document.getElementById("carousel_next") as HTMLElement;
              carousel_next.click();
              console.log("the data is correct");
            }

          }, error => {
            console.log("the error is " + error);
            alert("Could not connect to wifi ,may be the password is wrong");

          })


          // let carousel_next =document.getElementById("carousel_next") as HTMLElement;
          // carousel_next.click();
        }else{
          alert("Please enter your wifi password or leave it empty if open")
        }
      }
      }, error => {
        console.log("the error is " + error);
        alert("Wifi name is not correct");

      })
    }
  }
}
