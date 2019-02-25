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

}
