/**
 * Created by zack on 16/6/13.
 */
import {createAction} from 'redux-actions';
import * as markdown from 'markdown';
import * as types from '../constants/ActionTypes';
import * as RongIm from '../services/RongIm';
import * as storageService from '../services/storage';

export const getHistoryMessagesType=createAction(types.GET_CHART,async (type,targetId,oldestMessageId,count)=>{
    return await RongIm.getHistoryMessagesType(type,targetId,oldestMessageId,count);
},(type,targetId,oldestMessageId,count,resolved,rejected)=>{
    return {
        resolved,
        rejected,
        userId:targetId,
        sync: 'chat'
    }
});

export const sendMessage=createAction(types.SEND_CHART,async(type,content,targetId,pushContent,pushData)=>{
    return await RongIm.sendMessage(type,content,targetId,pushContent,pushData);
},(type,content,targetId,pushContent,pushData,resolved,rejected)=>{
    return {
        resolved,
        rejected,
        userId:targetId
    }
});

export const updateChat=(message)=>{
    return {
        type:types.UPDATE_CHART,
        payload:message,
        meta:{userId:message.sendUserId},
        sync: 'chat'
    }
};
export const clearMessagesUnreadStatus=createAction(types.CLEAR_MESSAGE_UNREAD,async(type,targetId)=>{
    return await  RongIm.clearMessagesUnreadStatus(type,targetId);
},(type,targetId,i,resolved,rejected)=>{
    return {
        resolved,
        userId:i,
        sync: 'message'
    }
});

export const RongImlogout=createAction(types.LOGOUT,()=>{
    return RongIm.logout();
});



