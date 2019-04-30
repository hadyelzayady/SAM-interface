import { Action } from '../_models/event';

export interface Message {
    connected_component_id: number;
    port_id: number;
    value: boolean
}