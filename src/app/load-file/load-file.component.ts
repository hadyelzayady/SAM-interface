import { Component, OnInit, ViewChild } from '@angular/core';
import { SimpleModalComponent } from 'ngx-simple-modal';


export interface LoadModel {

}
@Component({
  selector: 'app-load-file',
  templateUrl: './load-file.component.html',
  styleUrls: ['./load-file.component.css']
})

export class LoadFileComponent extends SimpleModalComponent<LoadModel, string> implements LoadModel {
  public file: File;
  isError = false;
  constructor() { super() }
  setFile(args) {
    console.log(args);
    this.file = args.target.files[0];
  }
  readingEnded = (e) => {
    this.result = e.target.result
    // this.close();

  }
  load() {
    if (this.file == null) {
      this.isError = true
      return;
    }
    let reader = new FileReader()
    reader.onloadend = this.readingEnded;
    reader.readAsText(this.file)
    this.close();

  }

  ngOnInit() {
  }

}
