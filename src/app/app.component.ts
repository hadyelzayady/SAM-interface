import { Component, ViewChild } from '@angular/core';
import { Diagram } from '@syncfusion/ej2-diagrams';
import { DiagramModule, DiagramComponent } from '@syncfusion/ej2-angular-diagrams';
import { EditSettingsModel, ToolbarItems, GridComponent } from '@syncfusion/ej2-angular-grids';
import { ClickEventArgs } from '@syncfusion/ej2-navigations';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild("diagram")
  public diagram: DiagramComponent;
  title = 'SAM-interface';
  public editSettings: EditSettingsModel;
  public toolbar: ToolbarItems[] | Object;

  @ViewChild('grid')
  public grid: GridComponent;
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.toolbar = [{ text: 'save', tooltipText: 'save diagram', id: 'save' }, { text: 'load', tooltipText: 'load diagram', id: 'load' }];
  }
  drop(args) {

  }
  clickHandler(args: ClickEventArgs): void {
    if (args.item.id === "load") {
      let x = localStorage.getItem('fileName');
      this.diagram.loadDiagram(x);
    }
    else if (args.item.id === "save") {
      let x = this.diagram.saveDiagram();
      localStorage.setItem('fileName', x);
    }
  }
}
