import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
export interface Cat {
  name: string;
}
@Injectable({
  providedIn: 'root'
})

export class DiagramApiService {

  constructor(private http: HttpClient) { }

  public sendSimulationData(files: File) {
    console.log(files)
    const endpoint = 'localhost:3000/api/diagram';
    const formData: FormData = new FormData();
    formData.append('fileKey', files, files.name);
    return this.http.post(endpoint, formData)
  }
}
