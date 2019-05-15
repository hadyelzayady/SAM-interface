import { Component, OnInit, ViewChild, Input, HostListener } from '@angular/core';
import { MenuItemModel, MenuEventArgs, MenuComponent } from '@syncfusion/ej2-angular-navigations';
import { enableRipple } from '@syncfusion/ej2-base';
import { FilenameDialogComponent } from '../filename-dialog/filename-dialog.component';
import { SimpleModalService } from 'ngx-simple-modal';
import { SharedVariablesService } from '../_services/shared-variables.service';
import { LoadFileComponent } from '../load-file/load-file.component';
import { DesignService } from '../_services';
import { first, takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { CanDeactivateComponent } from '../can-deactivate/can-deactivate.component';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css']
})
export class MenuBarComponent extends CanDeactivateComponent implements OnInit {
  animal: string;
  name: string;
  open_id = "open";
  save_id = "save"
  download_id = "download"
  load_id = "load";
  @ViewChild("menu") menubar: MenuComponent

  //
  canDeactivate(): boolean {
    return this.saved_design
  }
  menuItems: MenuItemModel[] = [
    {
      text: 'File',
      iconCss: 'em-icons e-file',
      items: [
        { id: this.open_id, text: 'Open', iconCss: 'em-icons e-open' },
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

  constructor(private simpleModalService: SimpleModalService, public sharedData: SharedVariablesService, private designService: DesignService, private router: Router) {
    super()

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
    this.sharedData.currentMode.pipe(takeUntil(this.sharedData.unsubscribe_sim)).subscribe(sim_mode => {
      this.sim_mode = sim_mode;
    });
  }
  saved_design: boolean = true
  setSaveStatus(saved: boolean) {
    this.saved_design = saved
    if (saved) {
      this.saved_undo_stack_length = this.sharedData.diagram.historyManager.undoStack.length
      this.menubar.items[1].iconCss = "em-icons e-check-mark"
    }
    else {
      this.menubar.items[1].iconCss = "em-icons e-cross-mark"
    }
  }
  //openadd file dialoge
  public select(args: MenuEventArgs): void {
    if (!this.sim_mode) {
      switch (args.item.id) {
        case this.save_id:
          {
            this.designService.saveDesign(this.sharedData.diagram.saveDiagram(), this.file_id).subscribe(() => {
              this.setSaveStatus(true)
              alert("file edited")
            }, error => {
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
