/**
 * Created by zack on 16/6/29.
 */
import {NativeModules} from 'react-native';
const {MobShare}=NativeModules;

export async function login(name){
    return await MobShare.login(name);
}

export async function shareQQ(title,titleUrl,imagePath,imageUrl){
    return await  MobShare.shareQQ(title,titleUrl,imagePath,imageUrl);
}

export async function shareWeixin(content,imagePath,imageUrl){
    return await  MobShare.shareWexin(content,imagePath,imageUrl);
}

export async function shareWeibo(content,imagePath,imageUrl){
    return await  MobShare.shareWeibo(content,imagePath,imageUrl);
}

export async function shareQzone(title,titleUrl,content,imagePath,imageUrl,stite,siteUrl){
    return await  MobShare.shareQZone(title,titleUrl,content,imagePath,imageUrl,stite,siteUrl);
}

export async function sharePyq(content,imagePath,imageUrl){
    return await  MobShare.shareWexin(content,imagePath,imageUrl);
}


