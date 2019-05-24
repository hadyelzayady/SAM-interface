import { NodeModel, PointPortModel, PortVisibility, NodeConstraints, ShapeModel, ImageModel } from '@syncfusion/ej2-angular-diagrams';
import { BoardPort } from './BoardPort';
import { Board } from './board';
import { addInfo_name, addInfo_type, ComponentType } from '../utils';
import { led_on_source, led_off_source } from './image_sources';

export class Led extends Board {
    static simBehaviour(value: boolean, led_node: NodeModel) {
        let source;
        if (value)
            source = led_on_source
        else
            source = led_off_source
        try {
            led_node.shape = {
                type: 'Image',
                source: source
            }

        } catch (error) {
            // console.log(error)
        }
    }
    static ports: PointPortModel[] = [new BoardPort(470 / 960, 620 / 680, "2").toJSON(), new BoardPort(560 / 960, 620 / 680, "3").toJSON()];

    static id = "Led";
    static shape = <ShapeModel>{
        type: 'Image',
        source: led_off_source
    }
    static getObj(): NodeModel {
        return {
            ports: this.ports,
            id: this.id,
            shape: this.shape,
            constraints: this.constraints,
            addInfo: { [addInfo_name]: Led.name, [addInfo_type]: ComponentType.Software }
        }
    }

}
