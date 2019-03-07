import { Injectable } from '@angular/core';
import { ConnectorModel, ConnectorConstraints } from '@syncfusion/ej2-diagrams';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }
  getConnector(): ConnectorModel {
    return {
      type: 'Orthogonal',
      constraints: ConnectorConstraints.Default | ConnectorConstraints.Bridging,
    }
  }
  // readingEnded = (e): string => { return e.target.result }
  // readFile(file: File) {
  //   let reader = new FileReader()
  //   reader.onloadend = this.readingEnded;
  //   reader.readAsText(file)
  //   console.log(reader.result)
  //   console.log(this.readingEnded)
  // }
}
