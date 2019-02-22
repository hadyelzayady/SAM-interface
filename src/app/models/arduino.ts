import { NodeModel, PointPortModel, PortVisibility, NodeConstraints } from '@syncfusion/ej2-angular-diagrams';
import { BoardPort } from './BoardPort';
import { Board } from './board';

export class Arduino extends Board implements NodeModel {
    ports: PointPortModel[] = [new BoardPort(324 / 960, 33 / 680, "2").toJSON()];
    id = "Arduino";

    // constraints = ~NodeConstraints.InConnect & ~NodeConstraints.OutConnect
    constructor() {
        super()
    }
    toJSON(): NodeModel {
        return {
            ports: this.ports,
            id: this.id,
            shape: {
                type: 'Image',
                source: "../assets/arduino2.png"
            },
            constraints: this.constraints
        }
    }

}
