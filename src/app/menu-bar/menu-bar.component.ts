import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MenuItemModel, MenuEventArgs } from '@syncfusion/ej2-angular-navigations';
import { enableRipple } from '@syncfusion/ej2-base';
import { FilenameDialogComponent } from '../filename-dialog/filename-dialog.component';
import { SimpleModalService } from 'ngx-simple-modal';
import { SharedVariablesService } from '../_services/shared-variables.service';
import { LoadFileComponent } from '../load-file/load-file.component';
import { DesignService } from '../_services';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css']
})
export class MenuBarComponent implements OnInit {
  animal: string;
  name: string;
  open_id = "open";
  save_id = "save"
  download_id = "download"
  load_id = "load";
  private menuItems: MenuItemModel[] = [
    {
      text: 'File',
      iconCss: 'em-icons e-file',
      items: [
        { id: this.open_id, text: 'Open', iconCss: 'em-icons e-open' },
        { id: this.save_id, text: 'Save', iconCss: 'e-icons e-save' },
        { id: this.download_id, text: 'Download diagram on your computer', iconCss: 'e-icons e-save' },
        { id: this.load_id, text: 'Load Diagram from your computer', iconCss: 'e-icons e-load' },
      ]
    }
  ];
  @Input() file_id: number;

  constructor(private simpleModalService: SimpleModalService, public sharedData: SharedVariablesService, private designService: DesignService) { }

  ngOnInit() {
  }

  //openadd file dialoge
  private select(args: MenuEventArgs): void {
    console.log(args.item)

    switch (args.item.id) {
      case this.save_id:
        {
          this.designService.saveDesign(this.sharedData.diagram.saveDiagram(), this.file_id).pipe(first()).subscribe(file => {
            alert("file edited")
          }, error => {
            console.log(error)
          });
          break;
        }
      case this.download_id:
        {
          let disposable = this.simpleModalService.addModal(FilenameDialogComponent, {
            title: 'Download Digram as file',
            question: 'File name',
            file_content: this.sharedData.diagram.saveDiagram(),
            isdownload: true
          })
            .subscribe((filename) => {
              //We get modal result
              if (filename != "") {//isconfirmed has the value of this.result which is in filename-dialog
                // alert('accepted');
              }
              else {
                //nothing
              }
            });
          //We can close modal calling disposable.unsubscribe();
          //If modal was not closed manually close it by timeout
          // setTimeout(() => {
          //   disposable.unsubscribe();
          // }, 10000);
          break;
        }
      case this.load_id:
        {
          let disposable = this.simpleModalService.addModal(LoadFileComponent)
            .subscribe((data) => {
              //We get modal result
              if (data) {//isconfirmed has the value of this.result which is in filename-dialog
                try {
                  let x = this.sharedData.diagram.loadDiagram(data)
                }
                catch (e) {
                  alert("corrupted file")
                  this.sharedData.diagram.reset();
                }
              }
              else {
                //nothing
              }
            });
          break;
        }
    }

  }
}
