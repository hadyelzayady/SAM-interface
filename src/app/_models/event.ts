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
    SUCCESSFULL = 'successful',
    BOARD_NOT_START_SIM = 'simBoardNotStarted',
    BoardStartedSimulation = 'BoardStartedSimulation',
    //bind event 
    BIND_FAIL = "bind_error",
    BIND_SUCCESS = "bind_success",
    BIND_ERROR_CONNECT = "bind_connect_error"
}