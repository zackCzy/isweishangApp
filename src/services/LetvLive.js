/**
 * Created by zack on 16/6/27.
 */

import config from "../configs/index";
import _ from "lodash";
import crypto from "crypto"
import moment from 'moment';
import * as requestService from './request';
const activeVer = "3.1";

//查询云直播信息
export const searchLetvInfo = function (activityId, activityName, activityStatus, offSet, fetchSize) {
    let paramObj = {
        userid: config.letv_userid,
        activityId: activityId || "",
        activityName: activityName || "",
        activityStatus: activityStatus || "",
        fetchSize: fetchSize || 10,
        method: "lecloud.cloudlive.vrs.activity.vrsinfo.search",
        offSet: offSet || 0,
        ver: activeVer,
        timestamp: new Date().getTime()
    }
    let sign = _getSign(paramObj);
    paramObj['sign'] = sign;

    return requestService.get(config.letv_yun_live,paramObj);
}
//获取云直播推流地址
export const activePushUrl = function (activityId) {
    let paramObj = {
        userid: config.letv_userid,
        activityId: activityId || "",
        method: "lecloud.cloudlive.activity.getPushUrl",
        ver: activeVer,
        timestamp: new Date().getTime()
    }
    requestService.post(config.letv_yun_live,paramObj);
}

export const createRecTask = function (liveId,startTime,endTime) {
    let paramObj = {
        userid: config.letv_userid,
        liveId: liveId || "",
        startTime:moment(startTime).format("yyyyMMddHHmmss"),
        endTime:moment(endTime).format("yyyyMMddHHmmss"),
        method: "lecloud.cloudlive.rec.createRecTask",
        ver: activeVer,
        timestamp: new Date().getTime()
    }
    requestService.post(config.letv_yun_live,paramObj);
}

export const opendActivityLive = function (activityName,startTime,endTime,coverImgUrl,description,liveNum,codeRateTypes,needRecord,needTimeShift,needFullView,activityCategory,playMode) {
    let paramObj = {
        userid: config.letv_userid,
        activityName: activityName || "",
        startTime:moment(startTime).format("yyyyMMddHHmmss"),
        endTime:moment(endTime).format("yyyyMMddHHmmss"),
        coverImgUrl:coverImgUrl||"",
        description:description||"",
        liveNum:liveNum||1,
        codeRateTypes:codeRateTypes||"10,13,16,19,22,25,99",
        needRecord:needRecord||0,
        needTimeShift:needTimeShift||0,
        needFullView:needFullView||0,
        activityCategory:activityCategory||"",
        playMode:playMode||1,
        method: "lecloud.cloudlive.activity.create",
        ver: activeVer,
        timestamp: new Date().getTime()
    }
    requestService.post(config.letv_yun_live,paramObj);
}

//停止云直播
export const stopActiveLive = function (activityId) {
    let paramObj = {
        userid: config.letv_userid,
        activityId: activityId || "",
        method: "lecloud.cloudlive.activity.stop",
        ver: activeVer,
        timestamp: new Date().getTime()
    }
    requestService.post(config.letv_yun_live,paramObj);
}

//上传云直播封面
export const uploadActiveLiveImage = function (activityId, file) {
    let paramObj = {
        userid: config.letv_userid,
        activityId: activityId || "",
        method: "lecloud.cloudlive.activity.modifyCoverImg",
        ver: activeVer,
        timestamp: new Date().getTime(),
        file: file
    }
    requestService.post(config.letv_yun_live,paramObj);
}



//工具方法
function md5(str, encoding) {
    return crypto
        .createHash('md5')
        .update(str, 'utf8')
        .digest(encoding || 'hex');
};
function _getSign(_param) {
    let _paramArray = mapKeysort(_param);
    let _paramString = _formatBizQueryParaMap(_paramArray);
    _paramString += config.letv_skey;
    return md5(_paramString);
}
function mapKeysort(param) {
    let tempArray = [];
    for (let key in param) {
        let obj = {};
        obj[key] = param[key];
        tempArray.push(obj);
    }
    tempArray = tempArray.sort((a, b)=> {
        let ak = "";
        let bk = "";
        for (let key in a) {
            ak = key;
        }
        for (let key in b) {
            bk = key;
        }
        return ak > bk ? 1 : -1;
    });
    return tempArray;
}
function _formatBizQueryParaMap(_param) {
    let buff = "";
    _param.forEach(function (item, index) {
        for (let key in item) {
            buff += (key + item[key]);
        }
    });
    return buff;
}

