import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services';
import { DesignFile } from '../_models/DesignFile'
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  design_files: DesignFile[];
  constructor(private userService: UserService) { }

  ngOnInit() {
    this.loadUserDesigns();
  }
  loadUserDesigns() {
    this.userService.getDesignFiles().pipe(first()).subscribe(files => {
      this.design_files = files;
    });
  }

}
