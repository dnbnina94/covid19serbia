import { 
    FETCHED_DATA,
    DAILY_COVID_DATA,
    REGIONAL_COVID_DATA, 
    COVID_AMBULANCES,
    FETCHING_DATA
} from '../../consts';

const initialState = {
    fetching: false
};
const dataTypes = [DAILY_COVID_DATA, REGIONAL_COVID_DATA, COVID_AMBULANCES];
dataTypes.forEach(d => {
    initialState[d] = {
        data: [],
        dataInfo: null
    }
});

const dataReducer = (state = initialState, action) => {
    const retState = {...state};
    switch(action.type) {
        case FETCHING_DATA:
            retState.fetching = true;
            return retState;
        case FETCHED_DATA:
            retState[action.payload.dataType] = action.payload.data;
            retState.fetching = false;
            return retState;
        default:
            return state;
    }
}

export default dataReducer;