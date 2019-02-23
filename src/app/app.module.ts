import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DiagramModule, SymbolPaletteModule, UndoRedoService } from '@syncfusion/ej2-angular-diagrams';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { ToolBarComponent } from './tool-bar/tool-bar.component';
import { GridModule, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import { SharedVariablesService } from './shared-variables.service';

@NgModule({
  declarations: [
    AppComponent,
    SideBarComponent,
    ToolBarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DiagramModule,
    GridModule,
    ToolbarModule,
    SymbolPaletteModule,
  ],
  providers: [ToolbarService, SharedVariablesService, UndoRedoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
