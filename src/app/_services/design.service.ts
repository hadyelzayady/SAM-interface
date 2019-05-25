import { Injectable, Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User, DesignFile, ReserveComponentsResponse } from '../_models';
import { SharedVariablesService } from './shared-variables.service';
import { Components } from '../_models/Components';
import { Observable } from 'rxjs';
import { filter, map, flatMap, timestamp } from 'rxjs/operators';
import { Board } from '../_models/board';
import { NodeModel, PortModel, PortVisibility, PortConstraints } from '@syncfusion/ej2-angular-diagrams';
import { nodeDesignConstraints, connectorDesignConstraints, addInfo_componentId, addInfo_name, addInfo_reserved, addInfo_type, ComponentType, setImageSize, addInfo_simValue, addInfo_pinType, PinType_VCC } from '../utils';
@Injectable()
export class DesignService {
    getReservedComponents(file_id: number) {
        return this.http.get<ReserveComponentsResponse[]>(`${this.baseurl}/${file_id}/reserve`)
    }
    unreserve(file_id: number) {
        return this.http.delete(`${this.baseurl}/${file_id}/reserve`)
    }

    constructor(private http: HttpClient, private sharedData: SharedVariablesService) { }
    private baseurl = this.sharedData.baseurl + '/design'
    getAll() {
        return this.http.get<User[]>(`/api/users`);
    }

    getImage(board_id) {
        return this.http.get(`${this.sharedData.imageUrl}${board_id}/image`, {
            responseType: "blob"
        });
    }

    reserve(reservecomps: {}, fileid: number) {
        return this.http.post<ReserveComponentsResponse[]>(`${this.baseurl}/${fileid}/reserve`, reservecomps)
    }
    saveDesign(file_data: string, fileid: number) {
        const formData: FormData = new FormData();

        formData.append("file", file_data)
        return this.http.put(`${this.baseurl}/designfile/${fileid}`, formData);
    }

    getDesignFileById(id) {
        return this.http.get<string>(`${this.baseurl}/designfile/${id}`)
    }

    createDesignFile(filename: string) {
        return this.http.post<DesignFile>(`${this.baseurl}/designfile`, { filename: filename })
    }
    deleteDesignFile(file_id: number) {
        // console.log("sendig delete file")
        return this.http.delete(`${this.baseurl}/designfile/${file_id}`)
    }

    sendDesignConnections(connections: any, design_id) {

        const endpoint = `${this.baseurl}/${design_id}/connections`;
        return this.http.post(endpoint, connections)
    }
    getSideBarItems(): Observable<NodeModel[][]> {
        return this.http.get(`${this.baseurl}/components`).pipe(map(response => {
            let components = response as Components;
            let i = 0;
            console.log(response)
            console.log("components", components)
            let builtin_boards = [] as NodeModel[]
            let user_boards = [] as NodeModel[]
            components.boards.forEach(board => {
                let node: NodeModel = {};
                node.id = `${board.name}_` + i++
                node.addInfo = { [addInfo_name]: `${board.name}`, [addInfo_componentId]: board.id, [addInfo_reserved]: false, [addInfo_type]: ComponentType.Hardware }
                node.shape = { type: "Image", source: `${this.sharedData.imageUrl}${board.id}/image` }
                node.constraints = nodeDesignConstraints
                console.log("bar dports", board.ports)
                if (board.ports.length != 0) {
                    node.ports = board.ports
                    node.ports.forEach(port => {
                        console.log("port addino", port.addInfo)
                        port.constraints = PortConstraints.InConnect | PortConstraints.OutConnect;
                        port.visibility = PortVisibility.Visible;
                        port.addInfo = port.addInfo || {}
                        port.addInfo[addInfo_simValue] = port.addInfo[addInfo_pinType] == PinType_VCC ? true : false
                    })
                }

                node.annotations = [{
                    content: node.id,
                }]
                if (board.UserId == null) {
                    builtin_boards.push(node)
                }
                else {
                    user_boards.push(node)
                }
            });
            return [builtin_boards, user_boards];
        }))
    }

}