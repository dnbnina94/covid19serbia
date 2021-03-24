import { 
    LOADING_START, 
    LOADING_STOP,
    MENU_OPENED,
    MENU_CLOSED,
    UPDATE_WIDTH,
    UPDATE_HEIGHT
} from "../../consts";

const initialState = {
    loading: false,
    menuOpened: false,
    width: undefined,
    height: undefined
}

const uiRedcuer = (state = initialState, action) => {
    const retState = {...state};
    switch (action.type) {
        case LOADING_START: 
            retState.loading = true;
            return retState;
        case LOADING_STOP:
            retState.loading = false;
            return retState;
        case MENU_OPENED:
            retState.menuOpened = true;
            return retState;
        case MENU_CLOSED:
            retState.menuOpened = false;
            return retState;
        case UPDATE_WIDTH:
            retState.width = action.payload;
            return retState;
        case UPDATE_HEIGHT:
            retState.height = action.payload;
            return retState;
        default: 
            return state;
    }
}

export default uiRedcuer;