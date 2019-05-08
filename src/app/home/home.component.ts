import { Component, OnInit } from '@angular/core';
import { UserService, DesignService } from '../_services';
import { DesignFile } from '../_models/DesignFile'
import { first } from 'rxjs/operators';
import { FilenameDialogComponent } from '../filename-dialog/filename-dialog.component';
import { SimpleModalService } from 'ngx-simple-modal';
import { Router } from '@angular/router';
import { UserBoards } from '../_models/MiscInterfaces';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  design_files: DesignFile[];
  user_boards: UserBoards[];
  constructor(private userService: UserService, private designService: DesignService, private simpleModalService: SimpleModalService, private router: Router) { }

  ngOnInit() {
    this.loadUserDesigns();
  }
  loadUserDesigns() {
    this.userService.getDesignFiles().pipe(first()).subscribe(files => {
      this.design_files = files;
    });
    this.userService.getUserBoards().pipe(first()).subscribe(boards => {
      this.user_boards = boards;
    });
  }
  customBoardDesign() {
    this.router.navigateByUrl('/customboard');
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
          });
        }
      });
  }

}
