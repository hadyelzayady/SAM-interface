
import { Injectable, Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User, DesignFile, ReserveComponentsResponse } from '../_models';
import { SharedVariablesService } from './shared-variables.service';
import { Components } from '../_models/Components';
import { Observable } from 'rxjs';
import { filter, map, flatMap, timestamp } from 'rxjs/operators';
import { Board } from '../_models/board';
import { NodeModel, PortModel, PortVisibility } from '@syncfusion/ej2-angular-diagrams';
import { nodeDesignConstraints, connectorDesignConstraints, addInfo_componentId, addInfo_name, addInfo_reserved, addInfo_type, ComponentType, setImageSize } from '../utils';
import { board } from '../configure-sam/boards';

@Injectable({
  providedIn: 'root'
})
export class ConfigureSamService {

    constructor(private http: HttpClient, private sharedData: SharedVariablesService) { }
    private baseurl = this.sharedData.baseurl + '/design'

    getcomponents(){
        return this.http.get<board[]>(`${this.sharedData.baseurl}/users/component`)
    }
    addcomponent(board_id:String){
        return this.http.post<String>(`${this.sharedData.baseurl}/component`, {
            "component_id":board_id
            })
    }
    setport(port: String) {
        return this.http.post(`http://localhost:4000/setpublicport`, {
            "publicPort":port
            })
    }
    setwifiname(wifiname: String) {
        return this.http.post<String>(`http://localhost:4000/setwifiname`, {
            "wifiname":wifiname
            })
    }
    setwifipass(wifipass: String) {
        return this.http.post<String>(`http://localhost:4000/setwifipass`, {
            "wifipass":wifipass
            })
    }
    setserver(serverurl:String){
        return this.http.post<String>(`http://localhost:4000/setserver`, {
            "server":serverurl
            })
    }
    setid(id:String){
        return this.http.post<String>(`http://localhost:4000/setid`, {
            "id":id
            })
    }
    sethellomsg(helloMessage:String){
        return this.http.post<String>(`http://localhost:4000/sethellomessage`, {
            "helloMessage":helloMessage
            })
    }
    Sendhellomsg(){
        return this.http.get<String>(`http://localhost:4000/SEND_HELLO_MESSAGE`)
    }
}

