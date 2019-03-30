import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../_models';

@Injectable()
export class UserService {
    constructor(private http: HttpClient) { }
    getAll() {
        return this.http.get<User[]>(`/api/users`);
    }

    getById(id: number) {
        return this.http.get(`/api/users/` + id);
    }

    register(user: User) {
        return this.http.post(`http://localhost:3000/api/users/register`, user);
    }

    update(user: User) {
        return this.http.put(`/api/users/` + user.id, user);
    }

    delete(id: number) {
        return this.http.delete(`/users/` + id);
    }
    getDesignFiles() {
        return this.http.get(`/api/user/designfiles`)
    }
}