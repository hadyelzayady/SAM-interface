import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DiagramModule, SymbolPaletteModule, UndoRedoService, DiagramContextMenuService } from '@syncfusion/ej2-angular-diagrams';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { ToolBarComponent } from './tool-bar/tool-bar.component';
import { GridModule, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { ToolbarModule, MenuModule } from '@syncfusion/ej2-angular-navigations';
import { SharedVariablesService } from './shared-variables.service';
import { UtilsService } from './utils.service';
import { MenuBarComponent } from './menu-bar/menu-bar.component';
import { FilenameDialogComponent } from './filename-dialog/filename-dialog.component';
import { SimpleModalModule } from 'ngx-simple-modal';
import { ngFileSaver } from 'angular-file-saver'
import { FormsModule } from '@angular/forms';
import { LoadFileComponent } from './load-file/load-file.component';
@NgModule({
  declarations: [
    AppComponent,
    SideBarComponent,
    ToolBarComponent,
    MenuBarComponent,
    FilenameDialogComponent,
    LoadFileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DiagramModule,
    GridModule,
    ToolbarModule,
    SymbolPaletteModule,
    MenuModule,
    SimpleModalModule,
    FormsModule
  ],

  providers: [ToolbarService, SharedVariablesService, UndoRedoService, UtilsService, DiagramContextMenuService],
  bootstrap: [AppComponent],
  entryComponents: [
    FilenameDialogComponent
  ],
})
export class AppModule { }
