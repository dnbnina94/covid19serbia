import { 
    LOADING_START, 
    LOADING_STOP 
} from "../../consts";

const initialState = {
    loading: false
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
        default: 
            return state;
    }
}

export default uiRedcuer;