import {combineReducers} from 'redux';
import dataReducer from './data';
import uiRedcuer from './ui';

const rootReducer = combineReducers({
    data: dataReducer,
    ui: uiRedcuer
});

export default rootReducer;