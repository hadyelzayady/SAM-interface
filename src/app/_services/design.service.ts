import { Injectable, Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User, DesignFile } from '../_models';
import { SharedVariablesService } from './shared-variables.service';
import { Components } from '../_models/Components';
import { Observable } from 'rxjs';
import { filter, map, flatMap, timestamp } from 'rxjs/operators';
import { Board } from '../_models/board';
import { NodeModel, PortModel } from '@syncfusion/ej2-angular-diagrams';
import { nodeDesignConstraints, connectorDesignConstraints } from '../utils';

@Injectable()
export class DesignService {


    constructor(private http: HttpClient, private sharedData: SharedVariablesService) { }
    private baseurl = this.sharedData.baseurl + '/design'
    getAll() {
        return this.http.get<User[]>(`/api/users`);
    }


    reserve(reservecomps: {}, fileid: number) {
        return this.http.post(`${this.baseurl}/${fileid}/reserve`, reservecomps)
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

    getSideBarItems(): Observable<NodeModel[]> {
        return this.http.get(`${this.baseurl}/components`).pipe(map(response => {
            let components = response as Components;
            let i = 9;
            let boards = components.boards.map(board => {
                let node: NodeModel = {};
                node.id = board.name + i++
                node.addInfo = { "name": board.name, "ComponentId": board.id }
                node.shape = { type: "Image", source: board.image_path }
                node.constraints = nodeDesignConstraints
                node.ports = board.ports
                node.ports.forEach(port => {
                    port.constraints = connectorDesignConstraints;
                })
                return node;
            });
            console.log("components", boards)
            return boards;
        }))
    }

}