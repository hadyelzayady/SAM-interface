import { NodeModel, PointPortModel, PortVisibility, NodeConstraints } from '@syncfusion/ej2-angular-diagrams';
import { BoardPort } from './BoardPort';
import { Board } from './board';

export class Led extends Board {
    static ports: PointPortModel[] = [new BoardPort(470 / 960, 620 / 680, "2").toJSON(),new BoardPort(560 / 960, 620 / 680, "3").toJSON()];
    static id = "Led";


    static getObj(): NodeModel {
        return {
            ports: this.ports,
            id: this.id,
            shape: {
                type: 'Image',
                source: "../assets/led.png"
            },
            constraints: this.constraints,

            addInfo: { type: Led.name }
        }
    }

}
