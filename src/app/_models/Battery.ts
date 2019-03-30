import { NodeModel, PointPortModel, PortVisibility, NodeConstraints } from '@syncfusion/ej2-angular-diagrams';
import { BoardPort } from './BoardPort';
import { Board } from './board';

export class Battery extends Board {
    static ports: PointPortModel[] = [new BoardPort(480 / 960, 640 / 680, "3").toJSON(),new BoardPort(480 / 960, 40 / 680, "2").toJSON()];
    static id = "Battery";


    static getObj(): NodeModel {
        return {
            ports: this.ports,
            id: this.id,
            shape: {
                type: 'Image',
                source: "../assets/battery.png"
            },
            constraints: this.constraints,

            addInfo: { type: Battery.name }
        }
    }

}
