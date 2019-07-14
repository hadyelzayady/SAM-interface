import { Component, OnInit, ViewChild, Input, HostListener } from '@angular/core';
import { MenuItemModel, MenuEventArgs, MenuComponent } from '@syncfusion/ej2-angular-navigations';
import { enableRipple } from '@syncfusion/ej2-base';
import { FilenameDialogComponent } from '../filename-dialog/filename-dialog.component';
import { SimpleModalService } from 'ngx-simple-modal';
import { SharedVariablesService } from '../_services/shared-variables.service';
import { LoadFileComponent } from '../load-file/load-file.component';
import { DesignService } from '../_services';
import { first, takeUntil, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { CanDeactivateComponent } from '../can-deactivate/can-deactivate.component';
import { IExportOptions } from '@syncfusion/ej2-angular-diagrams';
import { ModalService } from '../modal.service';

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
  @ViewChild("menu") menubar: MenuComponent

  //

  menuItems: MenuItemModel[] = [
    {
      text: 'File',
      iconCss: 'em-icons e-file',
      items: [
        // { id: this.open_id, text: 'Open', iconCss: 'em-icons e-open' },
        { id: this.save_id, text: 'Save', iconCss: 'e-icons e-save' },
        { id: this.download_id, text: 'Download diagram on your computer', iconCss: 'e-icons e-save' },
        { id: this.load_id, text: 'Load Diagram from your computer', iconCss: 'e-icons e-load' },
      ]
    },
    {
      text: 'Saved',
      iconCss: 'em-icons e-check-mark',
    }
  ];
  @Input() file_id: number;


  constructor(private simpleModalService: SimpleModalService, public sharedData: SharedVariablesService, private designService: DesignService, private router: Router, private modalService: ModalService) {

  }
  saved_undo_stack_length = 0
  sim_mode = false

  ngOnInit() {
    this.sharedData.diagram.historyChange.subscribe(() => {
      if (this.saved_undo_stack_length == this.sharedData.diagram.historyManager.undoStack.length)
        this.setSaveStatus(true)
      else
        this.setSaveStatus(false)
    })
    this.sharedData.currentMode.pipe(takeUntil(this.sharedData.unsubscribe_design)).subscribe(sim_mode => {
      this.sim_mode = sim_mode;
    });

    this.options = {};
    this.options.mode = 'Data';
    // this.options.margin = { left: 10, right: 10, top: 10, bottom: 10 };
    this.options.fileName = 'format';
    this.options.format = 'JPG';
    this.options.region = 'Content';

    this.sharedData.currentSaveStatus.subscribe(status => {
      this.setSaveStatus(status)
    })
  }
  setSaveStatus(saved: boolean) {
    this.sharedData.saved_design = saved
    if (saved) {
      this.saved_undo_stack_length = this.sharedData.diagram.historyManager.undoStack.length
      this.menubar.items[1].iconCss = "em-icons e-check-mark"
    }
    else {
      this.menubar.items[1].iconCss = "em-icons e-cross-mark"
    }
  }


  //openadd file dialoge
  save_modal_id = "save-diagram-id"
  saved = false
  error_saved = false
  hide_modal_close_btn = true
  saveModalClose() {
    this.error_saved = false
    this.saved = false
    this.hide_modal_close_btn = true
    this.modalService.close(this.save_modal_id)

  }
  public options: IExportOptions;

  public select(args: MenuEventArgs): void {
    if (!this.sim_mode) {
      switch (args.item.id) {
        case this.save_id:
          {
            // this.options = {};
            // this.options.mode = 'Download';
            // this.options.format = 'PNG'
            // let im = this.sharedData.diagram.exportDiagram(this.options);
            // // this.sharedData.diagram.print(this.options);
            // console.log("he", im.toString())

            this.modalService.open(this.save_modal_id)

            let diagram_image = this.sharedData.diagram.exportDiagram(this.options);
            this.designService.saveDesign(this.sharedData.diagram.saveDiagram(), diagram_image, this.file_id).pipe(finalize(() => { this.hide_modal_close_btn = false })).subscribe(() => {
              this.saved = true
              this.error_saved = false
              this.setSaveStatus(true)
              // alert("file edited")

            }, error => {
              this.saved = false
              this.error_saved = true
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
}
