import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { SharedVariablesService } from '.';
import { CustomBoard } from '../_models/MiscInterfaces';
import { NodeModel } from '@syncfusion/ej2-angular-diagrams';
import { addInfo_componentId } from '../utils';

@Injectable({
  providedIn: 'root'
})
export class CustomBoardService {

  constructor(private http: HttpClient, private sharedData: SharedVariablesService) { }
  private baseurl = this.sharedData.baseurl + '/customboard'
  createCustomBoard(image: File, board: NodeModel, map) {
    const formData: FormData = new FormData();
    // console.log(isNewImage)
    formData.append("image", image)
    formData.append("board", JSON.stringify(board))
    formData.append("pinmap", JSON.stringify(map))
    let param = ''
    console.log("addinfo component id", board)
    // console.log("board id ", board.id)
    if (board.id != null) {
      param = `?board_id=${board.id}`
    }
    return this.http.post<CustomBoard>(`${this.baseurl}${param}`, formData)
  }
  deleteBoard(board_id: number) {
    return this.http.delete(`${this.baseurl}/${board_id}`)
  }
  getBoard(board_id) {
    return this.http.get<CustomBoard>(`${this.baseurl}?board_id=${board_id}`)
  }
}
