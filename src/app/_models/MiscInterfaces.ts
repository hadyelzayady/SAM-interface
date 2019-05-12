export interface ReserveComponentsResponse {
    id: number,
    reserved: boolean,
    ComponentId: 1,
    IP: string,
    port: number
}

export interface CustomBoard {
    id: number,
    ports: [],
    name: string,
    code_required: boolean,
    image_path: string,
    pin_map: { [key: string]: string }


}
export interface UserBoards {
    id: number,
    name: string
}

export interface LedEvent {
    value: boolean,
    led_node_index: string,
    target_port_id: string
}
