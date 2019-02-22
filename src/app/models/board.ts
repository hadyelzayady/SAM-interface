import { BoardPort } from './BoardPort';
import { PointPortModel, NodeConstraints } from '@syncfusion/ej2-diagrams';
import { NullAstVisitor } from '@angular/compiler';

export abstract class Board {
    shape: {
        type: 'Image',
        source: "../assets/arduino2.png"
    };

    constraints = ~NodeConstraints.InConnect & ~NodeConstraints.OutConnect
    constructor(source: string) {
        // this.shape = "../assets/arduino2.png";
    }

    toJSON() {
        return {
            shape: this.shape,
            constraints: this.constraints
        }
    }

}
