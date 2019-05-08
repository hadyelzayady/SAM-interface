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
  createCustomBoard(image: File, isNewImage: boolean, board: NodeModel) {
    const formData: FormData = new FormData();
    console.log(isNewImage)
    if (isNewImage) {
      formData.append("image", image)
    }
    formData.append("board", JSON.stringify(board))
    let param = ''
    console.log("addinfo component id", board)
    if (board.id != null) {
      param = `?board_id=${board.id}`
    }
    return this.http.post<CustomBoard>(`${this.baseurl}${param}`, formData)
  }

  getBoard(board_id) {
    return this.http.get<CustomBoard>(`${this.baseurl}?board_id=${board_id}`)
  }
}
