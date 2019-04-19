import { PointPortModel, NodeModel } from '@syncfusion/ej2-angular-diagrams';
import { nodeSimConstraints, nodeDesignConstraints } from '../utils'
interface Board extends NodeModel {
    name: string,
    component_id: number
    image_path: string
}

export class Components {
    boards: Board[]
}

// export interface Arduino2 ext