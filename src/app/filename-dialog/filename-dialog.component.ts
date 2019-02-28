import { Component, OnInit, Inject, ElementRef, ViewChild, Injectable } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { EmitType } from '@syncfusion/ej2-base';
import { SharedVariablesService } from '../shared-variables.service';
import { SimpleModalComponent } from "ngx-simple-modal";
import { DomSanitizer } from '@angular/platform-browser';

export interface ConfirmModel {
  title: string;
  message: string;
}

@Component({
  selector: 'app-filename-dialog',
  templateUrl: './filename-dialog.component.html',
  styleUrls: ['./filename-dialog.component.css']
})
export class FilenameDialogComponent extends SimpleModalComponent<FilenameDialogComponent, boolean> implements FilenameDialogComponent {
  //boolean is the type of the returned value (this.result)

  title: string;
  question: string;
  fileUrl;
  data: string;
  filename = "diagramfile";
  constructor(private sanitizer: DomSanitizer) {
    super();
  }
  download() {
    // we set modal result as true on click on confirm button,
    // then we can get modal result from caller code
    const blob = new Blob([this.data], { type: 'application/json' });
    this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
    this.result = true;
    this.close();

  }

}
