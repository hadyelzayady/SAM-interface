import { NodeModel, PointPortModel, PortVisibility, NodeConstraints } from '@syncfusion/ej2-angular-diagrams';
import { BoardPort } from './BoardPort';
import { Board } from './board';
import { addInfo_name, addInfo_type, ComponentType, local_udp_server_port, addinfo_IP, addinfo_port } from '../utils';

export class Led extends Board {
    static ports: PointPortModel[] = [new BoardPort(470 / 960, 620 / 680, "2").toJSON(), new BoardPort(560 / 960, 620 / 680, "3").toJSON()];

    static id = "Led";

    static getObj(): NodeModel {
        return {
            ports: this.ports,
            id: this.id,
            shape: {
                type: 'Image',
                source: "../assets/redLED_off.jpg"
            },
            constraints: this.constraints,
            addInfo: { [addInfo_name]: Led.name, [addInfo_type]: ComponentType.Software, [addinfo_IP]: 'clientIP', [addinfo_port]: local_udp_server_port }
        }
    }

}
