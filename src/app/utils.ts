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
export const addInfo_simValue = "sim_value";
export const addInfo_pinType = "pin_type";
export enum ComponentType { Hardware, Software }
export enum SwitchValue { ON, OFF };
export const PinType_GROUND = "GROUND"
export const PinType_VCC = "VCC"
export const PinType_IN_OUT = "I/O"
export function setImageSize(width, height) {
    this.board_props.width = width
}


