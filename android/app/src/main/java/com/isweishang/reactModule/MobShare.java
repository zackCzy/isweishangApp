package com.isweishang.reactModule;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.isweishang.LoginApi;
import com.isweishang.OnLoginListener;
import com.isweishang.UserInfo;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import cn.sharesdk.framework.Platform;
import cn.sharesdk.framework.PlatformActionListener;
import cn.sharesdk.framework.ShareSDK;
import cn.sharesdk.sina.weibo.SinaWeibo;
import cn.sharesdk.tencent.qq.QQ;
import cn.sharesdk.tencent.qzone.QZone;
import cn.sharesdk.wechat.friends.Wechat;

/**
 * Created by zack on 16/6/28.
 */
public class MobShare extends ReactContextBaseJavaModule {
    private ReactApplicationContext reactContext;

    public MobShare(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;

    }

    @Override
    public String getName() {
        return "MobShare";
    }

    @ReactMethod
    public void login(String platformName, final Promise promise) {
        LoginApi api = new LoginApi();
        //设置登陆的平台后执行登陆的方法
        api.setPlatform(platformName);
        api.setOnLoginListener(new OnLoginListener() {
            public void onLogin(String platform, HashMap<String, Object> res) {
                WritableMap map = Arguments.createMap();
                Iterator iter = res.entrySet().iterator();
                while (iter.hasNext()) {
                    Map.Entry entry = (Map.Entry) iter.next();
                    Object key = entry.getKey();
                    Object val = entry.getValue();
                    map.putString(key.toString(), val.toString());
                }
                promise.resolve(map);
            }

            public void error(String err) {
                promise.reject(err);
            }
        });
        api.login(this.reactContext);
    }

    @ReactMethod
    public void shareQZone(String title, String url, String content, String imagesPath,String images,  String stite, String siteUrl, final Promise promise) {
        QZone.ShareParams sp = new QZone.ShareParams();
        if (title != null) {
            sp.setTitle(title);
        }
        if (url != null) {
            sp.setTitleUrl(url); // 标题的超链接
        }
        if (content != null) {
            sp.setText(content);
        }
        if (images != null) {
            sp.setImageUrl(images);
        }
        if (imagesPath != null) {
            sp.setImagePath(imagesPath);
        }
        if (stite != null) {
            sp.setSite(stite);
        }
        if (siteUrl != null) {
            sp.setSiteUrl(siteUrl);
        }
        Platform qzone = ShareSDK.getPlatform(QZone.NAME);
        qzone.setPlatformActionListener(new PlatformActionListener() {
            @Override
            public void onComplete(Platform platform, int i, HashMap<String, Object> hashMap) {
                promise.resolve(1);
            }

            @Override
            public void onError(Platform platform, int i, Throwable throwable) {
                promise.reject(-1 + "");
            }

            @Override
            public void onCancel(Platform platform, int i) {
                promise.resolve(0);

            }
        }); // 设置分享事件回调
// 执行图文分享
        qzone.share(sp);
    }

    @ReactMethod
    public void shareWeibo(String content, String imagesPath, String imagesUrl,  final Promise promise) {
        SinaWeibo.ShareParams sp = new SinaWeibo.ShareParams();
        sp.setText("测试分享的文本");
        if (imagesPath != null) {
            sp.setImagePath(imagesPath);
        }
        if (imagesUrl != null) {
            sp.setImageUrl(imagesUrl);
        }
//        if (strings != null) {
//            sp.setImageArray(strings);
//        }
        Platform weibo = ShareSDK.getPlatform(SinaWeibo.NAME);
        weibo.setPlatformActionListener(new PlatformActionListener() {
            @Override
            public void onComplete(Platform platform, int i, HashMap<String, Object> hashMap) {
                promise.resolve(1);
            }

            @Override
            public void onError(Platform platform, int i, Throwable throwable) {
                promise.reject(-1 + "");
            }

            @Override
            public void onCancel(Platform platform, int i) {
                promise.resolve(0);
            }
        }); // 设置分享事件回调
// 执行图文分享
        weibo.share(sp);
    }

    @ReactMethod
    public void shareQQ(String title, String titleUrl, String imagePath, String imageUrl,  final Promise promise) {
        QQ.ShareParams qs = new QQ.ShareParams();
        if (title != null) {
            qs.setTitle(title);
        }
        if (titleUrl != null) {
            qs.setTitleUrl(titleUrl);
        }
        if (imagePath != null) {
            qs.setImagePath(imagePath);
        }
        if (imageUrl != null) {
            qs.setImageUrl(imageUrl);
        }
//        if (imagePaths != null) {
//            qs.setImageArray(imagePaths);
//        }
        Platform qq = ShareSDK.getPlatform(QQ.NAME);
        qq.setPlatformActionListener(new PlatformActionListener() {
            @Override
            public void onComplete(Platform platform, int i, HashMap<String, Object> hashMap) {
                promise.resolve(1);
            }

            @Override
            public void onError(Platform platform, int i, Throwable throwable) {
                promise.reject(-1 + "");
            }

            @Override
            public void onCancel(Platform platform, int i) {
                promise.resolve(0);
            }
        }); // 设置分享事件回调
// 执行图文分享
        qq.share(qs);
    }

    @ReactMethod
    public void shareWexin(String title, String imagePath,String imageUrl, final Promise promise) {

        Wechat.ShareParams ws = new Wechat.ShareParams();
        if (title != null) {
            ws.setTitle(title);
        }
        if (imagePath == null) {
            ws.setImagePath(imagePath);
            ws.setShareType(Platform.SHARE_IMAGE);
        } else if(imageUrl!=null){
            ws.setImageUrl(imageUrl);
            ws.setShareType(Platform.SHARE_IMAGE);
        } else{
            ws.setShareType(Platform.SHARE_TEXT);
        }
        Platform wx = ShareSDK.getPlatform(Wechat.NAME);
        wx.setPlatformActionListener(new PlatformActionListener() {
            @Override
            public void onComplete(Platform platform, int i, HashMap<String, Object> hashMap) {
                promise.resolve(1);
            }

            @Override
            public void onError(Platform platform, int i, Throwable throwable) {
                promise.reject(-1 + "");
            }

            @Override
            public void onCancel(Platform platform, int i) {
                promise.resolve(0);
            }
        }); // 设置分享事件回调
        wx.share(ws);
    }
}
