import { Component, OnInit, Inject, ElementRef, ViewChild, Injectable } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { EmitType } from '@syncfusion/ej2-base';
import { SharedVariablesService } from '../_services/shared-variables.service';
import { SimpleModalComponent } from "ngx-simple-modal";
import { DomSanitizer } from '@angular/platform-browser';

export interface PromptModel {
  title: string;
  question: string;
  file_content?: string;
  isdownload: boolean
}

@Component({
  selector: 'app-filename-dialog',
  templateUrl: './filename-dialog.component.html',
  styleUrls: ['./filename-dialog.component.css']
})
export class FilenameDialogComponent extends SimpleModalComponent<PromptModel, string> implements PromptModel {
  //boolean is the type of the returned value (this.result)

  title: string;
  question: string;
  fileUrl;
  file_content?: string;
  filename = "diagramfile";
  isdownload: boolean
  constructor(private sanitizer: DomSanitizer) {
    super();
    this.result = ""
  }
  download() {
    // we set modal result as true on click on confirm button,
    // then we can get modal result from caller code
    const blob = new Blob([this.file_content], { type: 'application/json' });
    this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
    this.result = this.filename;
    this.close();
  }

  create() {
    this.result = this.filename;
    this.close();
  }
  myClose() {
    this.result = ""
    this.close();
  }
}
