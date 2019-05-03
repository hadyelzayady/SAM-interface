export enum Action {
    JOINED,
    LEFT,
    RENAME
}

// Socket.io events
export enum SocketEvent {
    CONNECT = 'connect',
    DISCONNECT = 'disconnect',
    CONNECTION_ERROR = 'connect_error',
    SUCCESSFULL = 'successful'
}