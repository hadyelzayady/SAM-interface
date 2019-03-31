import { Injectable } from '@angular/core';
import { DiagramComponent } from '@syncfusion/ej2-angular-diagrams';
import { FilenameDialogComponent } from '../filename-dialog/filename-dialog.component';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';

@Injectable()
export class SharedVariablesService {

  diagram: DiagramComponent;
  dialog: DialogComponent;


  baseurl = "http://localhost:3000/api"
}
