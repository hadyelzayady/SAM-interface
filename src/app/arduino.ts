import { PointPortModel, PortVisibility, NodeConstraints, NodeModel } from '@syncfusion/ej2-angular-diagrams';

export class Arduino {
    id: string = "Arduino";
    type: string = "Image";
    public myports: PointPortModel[] = [{
        offset: {
            x: 324 / 960,
            y: 33 / 680
        },
        visibility: PortVisibility.Visible,


    }]
    toJSON() {
        let x: NodeModel = {
            id: 'Arduino',
            shape: {
                type: 'Image',
                source: "../assets/arduino2.png",
            },
            // constraints: ~NodeConstraints.InConnect & ~NodeConstraints.OutConnect,
            ports: this.myports,
        }
        return x;
    }
}
