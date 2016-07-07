package com.isweishang.reactModule;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.isweishang.MainActivity;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Iterator;

import cn.jpush.android.api.JPushInterface;

/**
 * Created by zack on 16/6/28.
 */
public class PushModule extends ReactContextBaseJavaModule {
    private ReactApplicationContext reactContext;
    private MyReceiver mMessageReceiver;
    public static final String MESSAGE_RECEIVED_ACTION = "com.isweishang.MESSAGE_RECEIVED_ACTION";
    public static final String KEY_TITLE = "title";
    public static final String KEY_MESSAGE = "message";
    public static final String KEY_EXTRAS = "extras";
    public static boolean isForeground = false;

    public PushModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        registerMessageReceiver();
    }

    @Override
    public String getName() {
        return "PushModule";
    }

    public void registerMessageReceiver() {
        mMessageReceiver = new MyReceiver();
        IntentFilter filter = new IntentFilter();
        //filter.setPriority(IntentFilter.SYSTEM_HIGH_PRIORITY);
        filter.addAction("cn.jpush.android.intent.REGISTRATION");
        filter.addAction("cn.jpush.android.intent.UNREGISTRATION");
        filter.addAction("cn.jpush.android.intent.MESSAGE_RECEIVED");
        filter.addAction("cn.jpush.android.intent.NOTIFICATION_RECEIVED");
        filter.addAction("cn.jpush.android.intent.NOTIFICATION_OPENED");
        filter.addAction("cn.jpush.android.intent.ACTION_RICHPUSH_CALLBACK");
        filter.addAction("cn.jpush.android.intent.CONNECTION");
        this.reactContext.getApplicationContext().registerReceiver(mMessageReceiver, filter);
    }

    public class MyReceiver extends BroadcastReceiver {
        private static final String TAG = "JPush";
        private Context context;
        private ReactApplicationContext reactContext;

        @Override
        public void onReceive(Context context, Intent intent) {
            Bundle bundle = intent.getExtras();

            Log.d(TAG, "[MyReceiver] onReceive - " + intent.getAction() + ", extras: " + printBundle(bundle));

            if (JPushInterface.ACTION_REGISTRATION_ID.equals(intent.getAction())) {
                String regId = bundle.getString(JPushInterface.EXTRA_REGISTRATION_ID);
                Log.d(TAG, "[MyReceiver] 接收Registration Id : " + regId);
                //send the Registration Id to your server...

            } else if (JPushInterface.ACTION_MESSAGE_RECEIVED.equals(intent.getAction())) {
                Log.d(TAG, "[MyReceiver] 接收到推送下来的自定义消息: " + bundle.getString(JPushInterface.EXTRA_MESSAGE));
                processCustomMessage(context, bundle);

            } else if (JPushInterface.ACTION_NOTIFICATION_RECEIVED.equals(intent.getAction())) {
                Log.d(TAG, "[MyReceiver] 接收到推送下来的通知");
                int notifactionId = bundle.getInt(JPushInterface.EXTRA_NOTIFICATION_ID);
                Log.d(TAG, "[MyReceiver] 接收到推送下来的通知的ID: " + notifactionId);

            } else if (JPushInterface.ACTION_NOTIFICATION_OPENED.equals(intent.getAction())) {
                Log.d(TAG, "[MyReceiver] 用户点击打开了通知");
                JPushInterface.reportNotificationOpened(context, bundle.getString(JPushInterface.EXTRA_MSG_ID));

                //打开自定义的Activity
                Intent i = new Intent(context, MainActivity.class);
                //i.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                i.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
                intent.putExtra("result", "hahaha");
                context.startActivity(i, bundle);
                //ritableMap map = Arguments.createMap();
                //map.putString("position", "left");
                //sendEvent("push",null);

            } else if (JPushInterface.ACTION_RICHPUSH_CALLBACK.equals(intent.getAction())) {
                Log.d(TAG, "[MyReceiver] 用户收到到RICH PUSH CALLBACK: " + bundle.getString(JPushInterface.EXTRA_EXTRA));
                //在这里根据 JPushInterface.EXTRA_EXTRA 的内容处理代码，比如打开新的Activity， 打开一个网页等..

            } else if (JPushInterface.ACTION_CONNECTION_CHANGE.equals(intent.getAction())) {
                boolean connected = intent.getBooleanExtra(JPushInterface.EXTRA_CONNECTION_CHANGE, false);
                Log.w(TAG, "[MyReceiver]" + intent.getAction() + " connected state change to " + connected);
            } else {
                Log.d(TAG, "[MyReceiver] Unhandled intent - " + intent.getAction());
            }
        }

        // 打印所有的 intent extra 数据
        private String printBundle(Bundle bundle) {
            StringBuilder sb = new StringBuilder();

            for (String key : bundle.keySet()) {
                if (key.equals(JPushInterface.EXTRA_NOTIFICATION_ID)) {
                    sb.append("\nkey:" + key + ", value:" + bundle.getInt(key));
                } else if (key.equals(JPushInterface.EXTRA_CONNECTION_CHANGE)) {
                    sb.append("\nkey:" + key + ", value:" + bundle.getBoolean(key));
                } else if (key.equals(JPushInterface.EXTRA_EXTRA)) {
                    if (bundle.getString(JPushInterface.EXTRA_EXTRA).isEmpty()) {
                        Log.i(TAG, "This message has no Extra data");
                        continue;
                    }

                    try {
                        JSONObject json = new JSONObject(bundle.getString(JPushInterface.EXTRA_EXTRA));
                        Iterator<String> it = json.keys();

                        while (it.hasNext()) {
                            String myKey = it.next().toString();
                            sb.append("\nkey:" + key + ", value: [" +
                                    myKey + " - " + json.optString(myKey) + "]");
                        }
                    } catch (JSONException e) {
                        Log.e(TAG, "Get message extra JSON error!");
                    }

                } else {
                    sb.append("\nkey:" + key + ", value:" + bundle.getString(key));
                }
            }
            return sb.toString();
        }

        //send msg to MainActivity
        private void processCustomMessage(Context context, Bundle bundle) {
//		if (MainActivity.isForeground) {
//			String message = bundle.getString(JPushInterface.EXTRA_MESSAGE);
//			String extras = bundle.getString(JPushInterface.EXTRA_EXTRA);
//			Intent msgIntent = new Intent(MainActivity.MESSAGE_RECEIVED_ACTION);
//			msgIntent.putExtra(MainActivity.KEY_MESSAGE, message);
//			if (!ExampleUtil.isEmpty(extras)) {
//				try {
//					JSONObject extraJson = new JSONObject(extras);
//					if (null != extraJson && extraJson.length() > 0) {
//						msgIntent.putExtra(MainActivity.KEY_EXTRAS, extras);
//					}
//				} catch (JSONException e) {
//
//				}
//
//			}
//			context.sendBroadcast(msgIntent);
//		}
        }
    }

    private void setCostomMsg(
            String eventName,
            @Nullable WritableMap params) {
        this.reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

}
