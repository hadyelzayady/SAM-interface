import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { board} from './boards';
import { BOARDS } from './boards-mocks';
import { ConfigureSamService } from '../_services/configure-sam.service';
import { element } from '@angular/core/src/render3';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-configure-sam',
  templateUrl: './configure-sam.component.html',
  styleUrls: ['./configure-sam.component.css']
})
export class ConfigureSamComponent implements OnInit {
  // @ViewChild("carousel_next") carousel_next:ElementRef;
  serverurl="https://thesambackend.herokuapp.com/";
  boards =BOARDS;
  selectedBoard: board;
  constructor(private configservice:ConfigureSamService,private router: Router,
    private route: ActivatedRoute) { }
  portvar:string;
  wifinamevar:string;
  wifipassvar:string;
  returnUrl: string;

  ngOnInit() {
    this.configservice.getcomponents().subscribe(data=>{
    
        console.log("the recieved component is"+data);
        this.boards=data;
      
      },error=>{
        console.log("the error is "+error);
        alert(error);
      
      })
      this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
      // this.returnUrl ="http://www.google.com"
  }
  onSelect(boardx: board): void {
    this.selectedBoard = boardx;
  }
  setcomponent(boardid: String): void {
    console.log("board x is with id:"+boardid);
    
    
     
      this.configservice.setserver(this.serverurl).subscribe(data=>{
        console.log("server is set with url:"+this.serverurl);
        
        this.configservice.sethellomsg("hello_"+boardid).subscribe(data=>{
          console.log("hellomsg is set to hello_"+boardid);
          this.configservice.Sendhellomsg().subscribe(data=>{
            console.log("hellomsg was sent");
            this.router.navigate(["home"]);
          this.configservice.addcomponent(boardid).subscribe(data=>{
            console.log("id is set to"+boardid);
          
          },error=>{
            console.log("the error is "+error);
            alert(error);
          
          })
        },error=>{
          console.log("the error is "+error);
          alert(error);
        
        })
    },error=>{
      console.log("the error is "+error);
      alert(error);
    
    })
     
    
    },error=>{
      console.log("the error is "+error);
      alert(error["res"]);
    
    })
  }
  setport():void{
    console.log("entered here");
this.configservice.setport(this.portvar).subscribe(data=>{
  console.log(data);
  if(data["res"]=="failed")
  console.log("the data is failed");
  let carousel_next =document.getElementById("carousel_next") as HTMLElement;
  carousel_next.click();


},error=>{
  console.log("the error is "+error);
 console.log(error)

})
  }
  setwifi():void{
    console.log("entered here");
this.configservice.setwifiname(this.wifinamevar).subscribe(data=>{
  if(data["res"]=="failled")
  console.log("the data is failed");
  else{

  this.configservice.setwifipass(this.wifipassvar).subscribe(data=>{
    if(data["res"]=="failled")
    console.log("the data is failed");
    else
    {
    let carousel_next =document.getElementById("carousel_next") as HTMLElement;
    carousel_next.click();
    console.log("the data is correct");
  }
  
  },error=>{
    console.log("the error is "+error);
    alert(error["res"]);
  
  })
    

  // let carousel_next =document.getElementById("carousel_next") as HTMLElement;
  // carousel_next.click();
}

},error=>{
  console.log("the error is "+error);
  alert(error["res"]);

})
  }
}
