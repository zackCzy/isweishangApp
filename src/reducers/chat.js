/**
 * Created by zack on 16/6/13.
 */

import * as types from '../constants/ActionTypes';
import * as storageService from '../services/storage';

let initialState = {
    chat:{
        chat:{}
    }
};
export default function (state = initialState, action) {
    const {payload, error, meta={}, type} = action;
    const {userId='0'}=meta;
    switch (action.type) {
        case types.GET_CHART:
            return {
                ...state,
                chat:{
                    [userId]:payload
                }
            }
        case types.SEND_CHART:
            if(!state.chat[userId]){
                state.chat[userId]=[];
            }
            if(payload){
                state.chat[userId].push(payload);
            }
            return {
                ...state
            }
        case types.UPDATE_CHART:
            if(!state.chat[userId]){
                state.chat[userId]=[];
            }
            if(payload){
                state.chat[userId].push(payload);
            }
            return {
                ...state
            }
        case types.LOGOUT:
            return initialState;
        default:
            return state;
    }
}