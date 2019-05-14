import { Action } from '../_models/event';

export interface BoardMessage {
    value: boolean,
    IP: string,
    port: number,
    pin_id: number
}

export interface Message {
    connected_component_id: number;
    port_id: number;
    value: boolean
}