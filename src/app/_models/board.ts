import { BoardPort } from './BoardPort';
import { NullAstVisitor } from '@angular/compiler';
import { SharedVariablesService } from '../_services/shared-variables.service';
import { NodeConstraints } from '@syncfusion/ej2-angular-diagrams';

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
