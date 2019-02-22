import { BoardPort } from './BoardPort';
import { PointPortModel, NodeConstraints } from '@syncfusion/ej2-diagrams';
import { NullAstVisitor } from '@angular/compiler';

export abstract class Board {

    constraints = NodeConstraints.Default & ~NodeConstraints.InConnect & ~NodeConstraints.OutConnect
    // constructor(source) {
    //     this.shape.source = source
    // }
    // toJSON() {
    //     return {
    //         shape: this.shape,
    //         constraints: this.constraints
    //     }
    // }

}
