import { 
    FETCHED_DATA,
    DAILY_COVID_DATA,
    REGIONAL_COVID_DATA 
} from '../../consts';

const initialState = {
    fetching: false
};
initialState[DAILY_COVID_DATA] = [];
initialState[REGIONAL_COVID_DATA] = [];

const dataReducer = (state = initialState, action) => {
    switch(action.type) {
        case FETCHED_DATA:
            const retState = {...state};
            retState[action.payload.dataType] = action.payload.data;
            retState.fetching = false;
            return retState;
        default:
            return state;
    }
}

export default dataReducer;