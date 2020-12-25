import { LOADING_START, LOADING_STOP } from "../../consts"

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