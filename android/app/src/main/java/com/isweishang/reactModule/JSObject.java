package com.isweishang.reactModule;

import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import android.widget.Toast;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.RCTEventEmitter;

/**
 * Created by zack on 16/7/4.
 */
public class JSObject {
    private ReactContext mReactContext;
    private WebView mWebView;
    public JSObject(ReactContext reactContext, WebView webView){
        mReactContext=reactContext;
        mWebView=webView;
    }
    @JavascriptInterface
    public void showToast(String text){
        Toast.makeText(mReactContext,text, Toast.LENGTH_SHORT).show();
    }

    @JavascriptInterface
    public void startShare(String json) {
        WritableMap nativeEvent = Arguments.createMap();
        nativeEvent.putString("message", json);
        mReactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
                mWebView.getId(), "topChange", nativeEvent);
    }
}
