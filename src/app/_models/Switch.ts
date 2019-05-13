import { NodeModel, PointPortModel, PortVisibility, NodeConstraints, ShapeModel, ImageModel } from '@syncfusion/ej2-angular-diagrams';
import { BoardPort } from './BoardPort';
import { Board } from './board';
import { addInfo_name, addInfo_type, ComponentType, local_udp_server_port, addinfo_IP, addinfo_port } from '../utils';

export class Switch extends Board {
    static SimBehaviour() {
        throw new Error("Method not implemented.");
    }
    static ports: PointPortModel[] = [new BoardPort(470 / 960, 620 / 680, "2").toJSON(), new BoardPort(560 / 960, 620 / 680, "3").toJSON()];

    static id = "Switch";
    static shape = <ShapeModel>{
        type: 'Image',
        source: "../assets/switch_on.svg"
    }
    static getObj(): NodeModel {
        return {
            ports: this.ports,
            id: this.id,
            shape: this.shape,
            constraints: this.constraints,
            addInfo: { [addInfo_name]: Switch.name, [addInfo_type]: ComponentType.Software, [addinfo_IP]: 'clientIP', [addinfo_port]: local_udp_server_port }
        }
    }

}
