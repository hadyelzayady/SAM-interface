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
    image_path: string


}
export interface UserBoards {
    id: number,
    name: string
}
