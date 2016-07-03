/**
 * Created by zack on 16/6/12.
 */

import {NativeModules} from 'react-native'
const {RongyunIm}=NativeModules;


export async function login(token,name,url) {
    return await RongyunIm.login(token,name,url);
}

export async function getConversationList(){
    return await RongyunIm.getConversationList();
}

export async function getHistoryMessagesType(type,targetId,oldestMessageId,count){
    return  await RongyunIm.getHistoryMessages(type,targetId,oldestMessageId,count);
}
export async function sendMessage(type,content,targetId,pushContent,pushData){
    return await RongyunIm.sendMessgae(type,content,targetId,pushContent,pushData);
}
export async function sendMessgaeImage(type,targetId,url,pushContent,pushData){
    return await RongyunIm.sendMessgaeImage(type,targetId,url,pushContent,pushData);
}

export async function clearMessagesUnreadStatus(type,targetId){
    return await RongyunIm.clearMessagesUnreadStatus(type,targetId);
}

export function logout(){
    return RongyunIm.disconnect();
}
