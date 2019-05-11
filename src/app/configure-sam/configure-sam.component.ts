import { Component, OnInit } from '@angular/core';
import { board} from './boards';
import { BOARDS } from './boards-mocks';


@Component({
  selector: 'app-configure-sam',
  templateUrl: './configure-sam.component.html',
  styleUrls: ['./configure-sam.component.css']
})
export class ConfigureSamComponent implements OnInit {

  boards = BOARDS;
  selectedBoard: board;
  constructor() { }

  ngOnInit() {
  }
  onSelect(boardx: board): void {
    this.selectedBoard = boardx;
  }
}
