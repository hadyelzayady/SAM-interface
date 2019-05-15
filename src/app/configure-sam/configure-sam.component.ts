import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { board} from './boards';
// import { BOARDS } from './boards-mocks';
import { ConfigureSamService } from '../_services/configure-sam.service';
import { element } from '@angular/core/src/render3';


@Component({
  selector: 'app-configure-sam',
  templateUrl: './configure-sam.component.html',
  styleUrls: ['./configure-sam.component.css']
})
export class ConfigureSamComponent implements OnInit {
  // @ViewChild("carousel_next") carousel_next:ElementRef;

  boards :board[];
  selectedBoard: board;
  constructor(private configservice:ConfigureSamService) { }
  portvar:string;
  wifinamevar:string;
  wifipassvar:string;

  ngOnInit() {
    this.configservice.getcomponents().subscribe(data=>{
    
        console.log(data);
        this.boards=data;
      
      },error=>{
        console.log("the error is "+error);
        alert(error);
      
      })

  }
  onSelect(boardx: board): void {
    this.selectedBoard = boardx;
  }
  setport():void{
    console.log("entered here");
this.configservice.setport(this.portvar).subscribe(data=>{
  if(data["res"]=="failed")
  console.log("the data is failed");
  let carousel_next =document.getElementById("carousel_next") as HTMLElement;
  carousel_next.click();


},error=>{
  console.log("the error is "+error);
  alert(error["res"]);

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
