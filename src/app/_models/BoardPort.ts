import { PointPortModel, PortVisibility, PortConstraints, PointModel } from '@syncfusion/ej2-angular-diagrams';
import { OffsetPosition } from '@syncfusion/ej2-popups';
import { addInfo_simValue, UNDEFINED } from '../utils';

export class BoardPort implements PointPortModel {
    id: string;
    offset: PointModel;
    visibility = PortVisibility.Visible;
    constraints = PortConstraints.InConnect | PortConstraints.OutConnect;
    // constraints = PortConstraints.InConnect | PortConstraints.OutConnect | PortConstraints.Draw;//make connection when hover over port


    constructor(x: number, y: number, id: string) {
        {
            this.offset = {
                x: x,
                y: y
            };
            this.id = id;


        }
    }


    toJSON(): PointPortModel {
        return {
            id: this.id,
            offset: {
                x: this.offset.x,
                y: this.offset.y
            },
            visibility: this.visibility,
            constraints: this.constraints,
            addInfo: {
                [addInfo_simValue]: UNDEFINED
            }
        }

    }
}
