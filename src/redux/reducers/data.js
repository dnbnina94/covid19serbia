import { 
    FETCHED_DATA,
    DAILY_COVID_DATA,
    REGIONAL_COVID_DATA, 
    COVID_AMBULANCES
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