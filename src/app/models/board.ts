import { BoardPort } from './BoardPort';
import { PointPortModel, NodeConstraints } from '@syncfusion/ej2-diagrams';
import { NullAstVisitor } from '@angular/compiler';
import { SharedVariablesService } from '../shared-variables.service';

export abstract class Board {

    static constraints = NodeConstraints.Default & ~NodeConstraints.InConnect & ~NodeConstraints.OutConnect
    constructor(private sharedVariables: SharedVariablesService) {
    }
    hell(): void {

    }
    ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
    }

    // toJSON() {
    //     return {
    //         shape: this.shape,
    //         constraints: this.constraints
    //     }
    // }

}
