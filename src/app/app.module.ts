import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DiagramModule, SymbolPaletteModule, UndoRedoService, DiagramContextMenuService } from '@syncfusion/ej2-angular-diagrams';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { ToolBarComponent } from './tool-bar/tool-bar.component';
import { GridModule, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { ToolbarModule, MenuModule } from '@syncfusion/ej2-angular-navigations';
import { SharedVariablesService, UtilsService, AuthenticationService, DesignService } from './_services/';
import { MenuBarComponent } from './menu-bar/menu-bar.component';
import { FilenameDialogComponent } from './filename-dialog/filename-dialog.component';
import { SimpleModalModule } from 'ngx-simple-modal';
import { ngFileSaver } from 'angular-file-saver'
import {ConfigureSamService}from './_services/configure-sam.service'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadFileComponent } from './load-file/load-file.component';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { AlertComponent } from './_directives/alert.component';
import { AlertService, UserService } from './_services';
import { RegisterComponent } from './register/register.component';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { DesignComponent } from './design/design.component';
import { AuthGuard } from './_guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { LoadingModalComponent } from './loading-modal/loading-modal.component';
import { WebSocketService } from './_services/web-socket.service';
import { SimCommunicationService } from './_services/sim-communication.service';
import { CustomBoardComponent } from './custom-board/custom-board.component';
import { CanDeactivateGuard } from './can-deactivate/can-deactivate.guard';
import { ConfigureSamComponent } from './configure-sam/configure-sam.component';
import { DashboardComponent } from './dashboard/dashboard.component';
@NgModule({
  declarations: [
    AppComponent,
    SideBarComponent,
    ToolBarComponent,
    MenuBarComponent,
    FilenameDialogComponent,
    LoadFileComponent,
    LoginComponent,
    AlertComponent,
    RegisterComponent,
    DesignComponent,
    HomeComponent,
    LoadingModalComponent,
    CustomBoardComponent,
    ConfigureSamComponent,
    DashboardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    DiagramModule,
    GridModule,
    ToolbarModule,
    SymbolPaletteModule,
    MenuModule,
    SimpleModalModule,
    FormsModule,
    NgbAlertModule,
    HttpClientModule,
  ],

  providers: [
    ToolbarService,
    SharedVariablesService,
    UndoRedoService, UtilsService,
    DiagramContextMenuService,
    AuthGuard,
    CanDeactivateGuard,
    AlertService, UserService, DesignService,ConfigureSamService
    , AuthenticationService, WebSocketService, SimCommunicationService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    FilenameDialogComponent,
    LoadFileComponent
  ],
})
export class AppModule { }
