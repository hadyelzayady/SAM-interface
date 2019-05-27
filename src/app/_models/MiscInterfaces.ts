export interface ReserveComponentsResponse {
    id: number,
    reserved: boolean,
    ComponentId: 1,
    IP: string,
    udp_port: number
    usb_ip_port: number
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
    name: string,
    is_public: boolean
}

export interface OutputEvent {
    value: boolean,
    target_node_index: number,
    target_port_index: number,
    source_node_index: number,
    source_port_index: number
}
