import { Injectable, Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User, DesignFile } from '../_models';
import { SharedVariablesService } from './shared-variables.service';
import { Components } from '../_models/Components';
import { Observable } from 'rxjs';
import { filter, map, flatMap } from 'rxjs/operators';
import { Board } from '../_models/board';
import { NodeModel, PortModel } from '@syncfusion/ej2-diagrams';
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

    getSideBarItems(): Observable<Components[]> {
        return this.http.get<Components[]>(`${this.baseurl}/components`).pipe(map(response => {
            const components = response as Components[];
            const boards = components["boards"];
            boards.map(data => {
                console.log(data)
                const board = data as NodeModel;
                console.log(board)
                board.addInfo = { "ComponentId": data.ComponentId as string }
                board.constraints = nodeDesignConstraints
                const ports = board.ports
                ports.map(port => {
                    const portmodel = port as PortModel;
                    portmodel.constraints = connectorDesignConstraints;
                })
                return board
            });
            console.log("components", components)
            components["boards"] = boards
            return components;
        }))
    }

}