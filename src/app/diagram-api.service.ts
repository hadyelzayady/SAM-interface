import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { KeyModifiers } from '@syncfusion/ej2-diagrams';
export interface Cat {
  name: string;
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

export class DiagramApiService {

  constructor(private http: HttpClient) {

  }

  // public sendSimulationData(files: File) {
  //   console.log(files)
  //   const endpoint = 'http://localhost:3000/api/diagram/code';
  //   const formData: FormData = new FormData();
  //   formData.append('file', files, files.name);
  //   return this.http.post(endpoint, formData)
  // }

  public sendDesignConnections(connections: any) {

    const endpoint = 'http://localhost:3000/api/diagram/connections';

    return this.http.post(endpoint, connections, httpOptions)
  }

  public sendCodeFiles(boards_codes: { [key: string]: File }) {

    const endpoint = 'http://localhost:3000/api/diagram/code';
    const formData: FormData = new FormData();
    for (let board_id in boards_codes) {
      formData.append("files", boards_codes[board_id])
      formData.append("boards[]", board_id)
    }
    return this.http.post(endpoint, formData)
  }

}
