import { 
    LOADING_START, 
    LOADING_STOP,
    MENU_OPENED,
    MENU_CLOSED,
    UPDATE_WIDTH,
    UPDATE_HEIGHT
} from "../../consts";

export const loadingStart = () => {
    return {
        type: LOADING_START
    }
}

export const loadingStop = () => {
    return {
        type: LOADING_STOP
    }
}

export const menuOpened = () => {
    return {
        type: MENU_OPENED
    }
}

export const menuClosed = () => {
    return {
        type: MENU_CLOSED
    }
}

export const updateWidth = (width) => {
    return {
        type: UPDATE_WIDTH,
        payload: width
    }
}

export const updateHeight = (height) => {
    return {
        type: UPDATE_HEIGHT,
        payload: height
    }
}