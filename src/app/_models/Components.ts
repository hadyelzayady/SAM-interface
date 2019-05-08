import { PointPortModel, NodeModel } from '@syncfusion/ej2-angular-diagrams';
import { nodeSimConstraints, nodeDesignConstraints } from '../utils'
interface Board extends NodeModel {
    name: string,
    image_path: string,
    UserId: number
}

export class Components {
    boards: Board[]
}

// export interface Arduino2 ext