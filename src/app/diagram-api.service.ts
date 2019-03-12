import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})

export class DiagramApiService {

  constructor(private http: HttpClient) { }

  public sendSimulationData(files: File) {
    console.log("inside sim")
    const endpoint = 'localhost:3000/api/diagram';
    const req = new HttpRequest('POST', endpoint, files, {
      reportProgress: false
    });
    // console.log(files)
    // this.http.post(endpoint, connections)
  }
}
