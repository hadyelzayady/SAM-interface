import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User, DesignFile } from '../_models';
import { SharedVariablesService } from './shared-variables.service';

@Injectable()
export class DesignService {
    constructor(private http: HttpClient, private sharedData: SharedVariablesService) { }
    getAll() {
        return this.http.get<User[]>(`/api/users`);
    }
    private baseurl = this.sharedData.baseurl

    saveDesign(file_data: string, fileid: number) {
        const formData: FormData = new FormData();

        formData.append("file", file_data)
        return this.http.put(`${this.baseurl}/design/designfile/${fileid}`, formData);
    }

    getDesignFileById(id) {
        return this.http.get<string>(`${this.baseurl}/design/designfile/${id}`)
    }

    createDesignFile(filename: string) {
        return this.http.post<DesignFile>(`${this.baseurl}/design/designfile`, { filename: filename })
    }



}