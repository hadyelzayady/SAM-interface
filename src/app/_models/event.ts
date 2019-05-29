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
    //sim
    SIM_CONNECTION_ERROR = 'sim_connect_error',
    SIM_CONNECTION_SUCCESSFUL = 'simulate_successful',
    BOARD_NOT_START_SIM = 'simBoardNotStarted',
    BoardStartedSimulation = 'BoardStartedSimulation',
    //bind event 
    BIND_FAIL = "bind_error",
    BIND_SUCCESS = "bind_success",
    BIND_ERROR_CONNECT = "bind_connect_error",
    //
    BOARD_UNRESERVED = "board_unreserved"
}