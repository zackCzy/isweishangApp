/**
 * Created by zack on 16/6/7.
 */
import UmengShare from 'rn-umeng-share';
import config from '../configs/index';

UmengShare.setAppKey(config.UmenKey);
//ios

//url:默认分享的链接
UmengShare.setWXAppId(config.weiXinAppKey,config.weiXinAppSecret,url)
//supportWebView:是否支持web分享
//UmengShare.setQQWithAppId(appId,appSecret,url,supportWebView)

//shareData示例
const shareData={
    url:'http://www.umeng.com',
    content:'分享的文字内容',
    title:'分享的标题',
    //imageSource:require('../someAssetImage.png')
    //或者
    imageSource:require('../someInternetImage.png')
}


//设置分享内容
UmengShare.setQQData(shareData)
UmengShare.setQzoneData(shareData)
UmengShare.setWechatSessionData(shareData)
UmengShare.setWechatTimelineData(shareData)

//只更改分享内容和图片,并弹出分享页面
UmengShare.presentSnsIconSheetView(content,require('../someAssetImage.png'))
UmengShare.presentSnsIconSheetView(content,{uri:'http://....someInternetImage.png'})


//android

UmengShare.setWXAppId(appId,appSecret)
UmengShare.setQQZone(appId,appSecret)

//弹出分享页面
UmengShare.openShareAction(content,title,url,require('../someAssetImage.png'))
UmengShare.openShareAction(content,title,url,{uri:'http://....someInternetImage.png'})
