import { NodeModel, PointPortModel, PortVisibility, NodeConstraints, ShapeModel, ImageModel } from '@syncfusion/ej2-angular-diagrams';
import { BoardPort } from './BoardPort';
import { Board } from './board';
import { addInfo_name, addInfo_type, ComponentType, local_udp_server_port, addinfo_IP, addinfo_port, addInfo_simValue, SwitchValue } from '../utils';
import { SharedVariablesService } from '../_services';
import { switch_on_source, switch_off_source } from './image_sources';

export class Switch extends Board {

    static Toggle(switch_node: NodeModel, sim_mode: boolean = true) {
        if (switch_node.addInfo[addInfo_simValue] || !sim_mode) {
            //on
            console.log("swtch off")
            switch_node.shape = this.shape_off
            switch_node.addInfo[addInfo_simValue] = false
            switch_node.ports.forEach(port => {
                port.addInfo[addInfo_simValue] = false
            })
        }
        else {
            console.log("switch on")
            switch_node.shape = this.shape_on
            switch_node.addInfo[addInfo_simValue] = true
        }
    }
    static SimBehaviour() {
        throw new Error("Method not implemented.");
    }
    static ports: PointPortModel[] = [new BoardPort(470 / 960, 620 / 680, "2").toJSON(), new BoardPort(560 / 960, 620 / 680, "3").toJSON()];

    static id = "Switch";
    static shape_on = <ShapeModel>{
        type: 'Image',
        source: switch_on_source
    }
    static shape_off = <ShapeModel>{
        type: 'Image',
        source: switch_off_source
    }
    static getObj(): NodeModel {
        return {
            ports: this.ports,
            id: this.id,
            shape: this.shape_off,
            constraints: this.constraints,
            addInfo: { [addInfo_name]: Switch.name, [addInfo_type]: ComponentType.Software, [addinfo_IP]: 'clientIP', [addinfo_port]: local_udp_server_port, [addInfo_simValue]: false }
        }
    }

}
