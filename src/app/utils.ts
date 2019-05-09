import { ConnectorConstraints, NodeConstraints, NodeModel } from '@syncfusion/ej2-angular-diagrams';

export const connectorDesignConstraints = ConnectorConstraints.Default | ConnectorConstraints.Bridging;
export const connectorSimConstraints = ConnectorConstraints.None

export const nodeDesignConstraints = NodeConstraints.Default & ~NodeConstraints.InConnect & ~NodeConstraints.OutConnect;
export const nodeSimConstraints = NodeConstraints.Default & ~NodeConstraints.Delete & ~NodeConstraints.InConnect;

export const addInfo_componentId = "componentId";
export const addinfo_IP = "IP";
export const addinfo_port = "port";
export const addInfo_name = "name";
export const addInfo_type = "type";
export const addInfo_reserved = "reserved";
export const addInfo_connectedComponentId = "connectedComponentId";
export enum ComponentType { Hardware, Software }
export const local_udp_server_port = "3003"

export function setImageSize(width, height) {
    this.board_props.width = width
}


