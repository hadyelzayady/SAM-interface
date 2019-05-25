import { Component, OnInit } from '@angular/core';
import { UserService, DesignService, AlertService } from '../_services';
import { DesignFile } from '../_models/DesignFile'
import { first } from 'rxjs/operators';
import { FilenameDialogComponent } from '../filename-dialog/filename-dialog.component';
import { SimpleModalService } from 'ngx-simple-modal';
import { Router } from '@angular/router';
import { UserBoards } from '../_models/MiscInterfaces';
import { CustomBoardService } from '../_services/custom-board.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  design_files: DesignFile[];
  user_boards: UserBoards[];
  constructor(private userService: UserService, private designService: DesignService, private customBoardService: CustomBoardService, private simpleModalService: SimpleModalService, private router: Router, private alertService: AlertService) { }

  ngOnInit() {
    this.loadUserDesigns();
    this.loadUserBoards()
  }
  loadUserDesigns() {
    this.userService.getDesignFiles().pipe(first()).subscribe(files => {
      this.design_files = files;
    });

  }
  loadUserBoards() {
    this.userService.getUserBoards().pipe(first()).subscribe(boards => {
      this.user_boards = boards;
    });
  }
  customBoardDesign() {
    this.router.navigateByUrl('/customboard');
  }
  
  deleteDesignFile(file_id: number, filename: string) {
    if (confirm("if you delete this file ,you will not be able to restore again,sure about delete?")) {
      this.designService.deleteDesignFile(file_id).subscribe((data) => {
        this.loadUserDesigns()
        this.alertService.success(`File ${filename}(${file_id}) deleted`)
      }, error => {
        this.alertService.error(`Sorry file ${filename} (${file_id}) couldn't be deleted`)
      })
    }
  }
  deleteBoard(board_id: number, board_name: string) {
    if (confirm("if you delete this file ,you will not be able to restore again,sure about delete?")) {
      this.customBoardService.deleteBoard(board_id).subscribe(() => {
        this.loadUserBoards()
        this.alertService.success(`Board ${board_name} (${board_id}) created`)
      }, error => {
        this.alertService.error(`Sorry board ${board_name} (${board_id}) couldn't be deleted`)
      })
    }
  }
  createNewFile() {
    let disposable = this.simpleModalService.addModal(FilenameDialogComponent, {
      title: 'Download Digram as file',
      question: 'File name',
      isdownload: false
    })
      .subscribe((filename) => {
        if (filename != "") {
          this.designService.createDesignFile(filename).subscribe(file => {
            // this.router.navigate(['design', file.id])
            this.loadUserDesigns()
            this.alertService.success(`file ${filename} created`)
            this.router.navigate([`/design/${file.id}`])
          }, error => {
            this.alertService.error(`Sorry File ${filename} couldn't be created`)
          });
        }
      });
  }

}
