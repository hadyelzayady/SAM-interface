import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User, DesignFile } from '../_models';
import { SharedVariablesService } from './shared-variables.service';

@Injectable()
export class UserService {
    constructor(private http: HttpClient, private sharedData: SharedVariablesService) { }
    private baseurl = this.sharedData.baseurl
    getAll() {
        return this.http.get<User[]>(`/api/users`);
    }

    getById(id: number) {
        return this.http.get(`/api/users/` + id);
    }

    register(user: User) {
        return this.http.post(`${this.sharedData.baseurl}/users/register`, user);
    }

    update(user: User) {
        return this.http.put(`/api/users/` + user.id, user);
    }

    delete(id: number) {
        return this.http.delete(`/users/` + id);
    }
    getDesignFiles() {

        return this.http.get<DesignFile[]>(`${this.baseurl}/users/designfiles`)
    }

    createDesignFile(filename: string) {
        return this.http.post<DesignFile>(`${this.baseurl}/users/designfile`, { filename: filename })
    }
}