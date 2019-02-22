import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DiagramModule, SymbolPaletteModule } from '@syncfusion/ej2-angular-diagrams';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { ToolBarComponent } from './tool-bar/tool-bar.component';
import { GridModule, EditService, ToolbarService, SortService } from '@syncfusion/ej2-angular-grids';

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
    SymbolPaletteModule,
  ],
  providers: [ToolbarService],
  bootstrap: [AppComponent]
})
export class AppModule { }
