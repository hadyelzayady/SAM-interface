import { ConnectorConstraints, NodeConstraints } from '@syncfusion/ej2-diagrams';

export const connectorDesignConstraints = ConnectorConstraints.Default | ConnectorConstraints.Bridging;
export const connectorSimConstraints = ConnectorConstraints.None

export const nodeDesignConstraints = NodeConstraints.Default & ~NodeConstraints.InConnect & ~NodeConstraints.OutConnect;
export const nodeSimConstraints = NodeConstraints.Default & ~NodeConstraints.Delete & ~NodeConstraints.InConnect;


