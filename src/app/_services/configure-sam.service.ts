
import { Injectable, Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { User, DesignFile, ReserveComponentsResponse } from '../_models';
import { SharedVariablesService } from './shared-variables.service';
import { Components } from '../_models/Components';
import { Observable } from 'rxjs';
import { filter, map, flatMap, timestamp } from 'rxjs/operators';
import { Board } from '../_models/board';
import { NodeModel, PortModel, PortVisibility } from '@syncfusion/ej2-angular-diagrams';
import { nodeDesignConstraints, connectorDesignConstraints, addInfo_componentId, addInfo_name, addInfo_reserved, addInfo_type, ComponentType, setImageSize } from '../utils';
import { board } from '../configure-sam/boards';
interface portresp {
    res: string

}
const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    })
}

@Injectable({
    providedIn: 'root'
})
export class ConfigureSamService {

    constructor(private http: HttpClient, private sharedData: SharedVariablesService) { }
    private baseurl = this.sharedData.baseurl + '/design'

    getcomponents() {
        return this.http.get<board[]>(`${this.sharedData.baseurl}/users/component`)
    }

    addcomponent(board_id: String,udpport: String,usbport:String) {
        return this.http.post<String>(`${this.sharedData.baseurl}/users/component`, {
            "component_id": board_id,
            "USBPORT": usbport,
            "UDPPORT":udpport
        }, httpOptions)
    }
    // setport(udpport: String,usbport:String,boardid:String) {
    //     return this.http.post(`${this.sharedData.baseurl}/users/component/setports`, {
    //         "BOARDID":boardid,
    //         "USBPORT": usbport,
    //         "UDPPORT":udpport
    //     }, httpOptions)
    // }
    setwifiname(wifiname: String) {
        return this.http.post<String>(`${this.sharedData.localhost_trayapp}setwifiname`, {
            "wifiname": wifiname
        }, httpOptions)
    }
    setwifipass(wifipass: String) {
        return this.http.post<String>(`${this.sharedData.localhost_trayapp}setwifipass`, {
            "wifipass": wifipass
        }, httpOptions)
    }

    setserver(serverurl: String) {
        return this.http.post<String>(`${this.sharedData.localhost_trayapp}setserver`, {
            "server": serverurl
        }, httpOptions)
    }
    setid(id: String) {
        return this.http.post<String>(`${this.sharedData.localhost_trayapp}setid`, {
            "id": id
        }, httpOptions)
    }
    getVersion(){
        return this.http.get<String>(`${this.sharedData.localhost_trayapp}GET_BOARD_TYPE`, {
        })
    }
    sethellomsg(helloMessage: String) {
        return this.http.post<String>(`${this.sharedData.localhost_trayapp}sethellomessage`, {
            "helloMessage": helloMessage
        }, httpOptions)
    }
    Sendhellomsg() {
        return this.http.get<String>(`${this.sharedData.localhost_trayapp}SEND_HELLO_MESSAGE`, httpOptions)
    }
    sendfinish() {
        return this.http.get<String>(`${this.sharedData.localhost_trayapp}FINISH_CONFIGURATIONS`, httpOptions)
    }
    unBindAll() {
        return this.http.post(`${this.sharedData.localhost_trayapp}UnBindAll`, "",{headers:new HttpHeaders({
            "Access-Control-Allow-Origin": "*"
          })
            
})
    }
    sendBindIPPort(ip, port) {
        return this.http.post(`${this.sharedData.localhost_trayapp}Bind`, { ip: ip, port: port },)
    }
}

