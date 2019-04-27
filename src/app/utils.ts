import { ConnectorConstraints, NodeConstraints } from '@syncfusion/ej2-angular-diagrams';

export const connectorDesignConstraints = ConnectorConstraints.Default | ConnectorConstraints.Bridging;
export const connectorSimConstraints = ConnectorConstraints.None

export const nodeDesignConstraints = NodeConstraints.Default & ~NodeConstraints.InConnect & ~NodeConstraints.OutConnect;
export const nodeSimConstraints = NodeConstraints.Default & ~NodeConstraints.Delete & ~NodeConstraints.InConnect;

export const addInfo_componentId = "componentId";
export const addinfo_IP_Port = "componentId";
export const addInfo_name = "name";
export const addInfo_type = "type";
export const addInfo_reserved = "reserved";
export const addInfo_connectedComponentId = "connectedComponentId";
export enum ComponentType { Hardware, Software }


