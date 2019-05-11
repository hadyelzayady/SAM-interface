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
                source: " data:image/jpeg;base64,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"
            },
            constraints: this.constraints,
            addInfo: { [addInfo_name]: Led.name, [addInfo_type]: ComponentType.Software, [addinfo_IP]: 'clientIP', [addinfo_port]: local_udp_server_port }
        }
    }

}
