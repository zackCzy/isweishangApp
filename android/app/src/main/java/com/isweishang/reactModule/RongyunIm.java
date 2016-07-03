package com.isweishang.reactModule;

import android.content.ContentResolver;
import android.content.Context;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Matrix;
import android.graphics.RectF;
import android.net.Uri;
import android.provider.MediaStore;
import android.support.annotation.Nullable;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;

import io.rong.imkit.RongIM;
import io.rong.imlib.RongIMClient;
import io.rong.imlib.model.Conversation;
import io.rong.imlib.model.Message;
import io.rong.imlib.model.UserInfo;
import io.rong.message.ImageMessage;
import io.rong.message.TextMessage;


public class RongyunIm extends ReactContextBaseJavaModule {
    //private  static final String token="kMD2NrkL8BhTdmZKe7mES9yadgm+aKaQ9tQDLONp/RY9iTJFUwhQdq0htTlGg7hMyJpoF3pjp7aum1l3Ia6Oj31tUHZX0kgJ";
    public ArrayList<Conversation.ConversationType> conversationTypes = new ArrayList<Conversation.ConversationType>();
    private ReactApplicationContext reactContext;

    public RongyunIm(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        conversationTypes.add(Conversation.ConversationType.APP_PUBLIC_SERVICE);
        conversationTypes.add(Conversation.ConversationType.CHATROOM);
        conversationTypes.add(Conversation.ConversationType.CUSTOMER_SERVICE);
        conversationTypes.add(Conversation.ConversationType.DISCUSSION);
        conversationTypes.add(Conversation.ConversationType.GROUP);
        conversationTypes.add(Conversation.ConversationType.PRIVATE);
        conversationTypes.add(Conversation.ConversationType.PUBLIC_SERVICE);
        conversationTypes.add(Conversation.ConversationType.PUSH_SERVICE);
        conversationTypes.add(Conversation.ConversationType.SYSTEM);
    }

    @Override
    public String getName() {
        return "RongyunIm";
    }

    private void sendEvent(ReactContext reactContext,
                           String eventName,
                           @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }
    @ReactMethod
    public void login(String token,final String name,final String url,final Promise promise) {

        RongIMClient.ConnectCallback callback = new RongIMClient.ConnectCallback() {

            @Override
            public void onTokenIncorrect() {

            }

            @Override
            public void onSuccess(String s) {
                Log.e("onSuccess", "成功登录 userid1:" + s);
                Uri uri= Uri.parse(url);
                UserInfo userInfo=new UserInfo(s,name,uri);
                RongIMClient.getInstance().setOnReceiveMessageListener(new MyReceiveMessageListener());

                if (RongIMClient.getInstance() != null && RongIMClient.getInstance() != null) {
                    /**
                     * 设置连接状态变化的监听器.
                     */
                    RongIMClient.getInstance().setConnectionStatusListener(new MyConnectionStatusListener());
                }
                if (RongIM.getInstance() != null) {
                    /**
                     * 接收未读消息的监听器。
                     *
                     * @param listener          接收所有未读消息消息的监听器。
                     */
                    //RongIM.getInstance().setOnReceiveUnreadCountChangedListener(new MyReceiveUnreadCountChangedListener());

                    /**
                     * 设置接收未读消息的监听器。
                     *
                     * @param listener          接收未读消息消息的监听器。
                     * @param conversationTypes 接收指定会话类型的未读消息数。
                     */
                    RongIM.getInstance().setOnReceiveUnreadCountChangedListener(new MyReceiveUnreadCountChangedListener(), Conversation.ConversationType.PRIVATE);

                }
                promise.resolve(s);

            }

            @Override
            public void onError(RongIMClient.ErrorCode errorCode) {
                Log.e("onSuccess", "error" + errorCode.getValue());
                promise.reject(errorCode.getMessage());
            }
        };
        RongIM.connect(token, callback);
    }


    //退出登录
    @ReactMethod
    public void disconnect(){
        RongIMClient.getInstance().disconnect();
    }
    //发送消息
    @ReactMethod
    public void sendMessgae(int i, String content, String targetId, String pushContent, String pushData, final Promise promise) {
        RongIMClient.getInstance().sendMessage(conversationTypes.get(i), targetId, TextMessage.obtain(content), pushContent, pushData, new RongIMClient.SendMessageCallback() {
            @Override
            public void onSuccess(Integer integer) {
                Log.d("onSuccess", "发送成功");

            }

            @Override
            public void onError(Integer integer, RongIMClient.ErrorCode errorCode) {
                Log.d("onSuccess", "发送失败");

            }
        }, new RongIMClient.ResultCallback<Message>() {
            @Override
            public void onError(RongIMClient.ErrorCode errorCode) {
                promise.reject(errorCode.getMessage());
            }

            @Override
            public void onSuccess(Message message) {
                Message msg = message;
                WritableMap map = Arguments.createMap();
                map.putString("position", "left");
                map.putString("targetId", msg.getTargetId());
                map.putInt("date", (int) msg.getSentTime());
                map.putString("sendUserId", msg.getSenderUserId());
                map.putString("uniqueId", msg.getUId());
                map.putInt("receivedTime", (int) msg.getReceivedTime());
                map.putInt("messageId", msg.getMessageId());
                map.putString("extra", msg.getExtra());
                map.putInt("conversationType", msg.getConversationType().getValue());
                String name="";
                String uriString="";
                map.putString("name",name);
                WritableMap image = Arguments.createMap();
                image.putString("uri",uriString);
                map.putMap("image", image);
                byte[] b = msg.getContent().encode();
                String jsonStr = null;
                String content = "";
                JSONObject jsonObj;
                try {
                    jsonStr = new String(b, "UTF-8");
                } catch (UnsupportedEncodingException e1) {

                }
                try {
                    jsonObj = new JSONObject(jsonStr);
                    if (jsonObj.has("content"))
                        content = jsonObj.optString("content");

                } catch (JSONException e) {

                }
                map.putString("text", content);
                map.putString("objectName", msg.getObjectName());
                map.putInt("state", msg.getSentStatus().getValue());
                promise.resolve(map);
            }

        });
    }

    public void insertMessage(int i, String targetId, String senderUserId, String content, final Promise promise) {
        RongIMClient.getInstance().insertMessage(conversationTypes.get(i), targetId, senderUserId, TextMessage.obtain(content), new RongIMClient.ResultCallback<Message>() {
            @Override
            public void onSuccess(Message message) {
                promise.resolve(message);
            }

            @Override
            public void onError(RongIMClient.ErrorCode errorCode) {
                promise.reject(errorCode.getMessage());
            }
        });
    }

    //发送图片消息
    public void sendImageMessage(int i, String targetId, String url, String pushContent, String pushData, final Promise promise) {
        File imageFileSource = new File(this.reactContext.getCacheDir(), "source.jpg");
        File imageFileThumb = new File(this.reactContext.getCacheDir(), "thumb.jpg");
        try {
            // 读取图片。
            InputStream is = this.reactContext.getAssets().open(url);

            Bitmap bmpSource = BitmapFactory.decodeStream(is);

            imageFileSource.createNewFile();

            FileOutputStream fosSource = new FileOutputStream(imageFileSource);

            // 保存原图。
            final boolean compress = bmpSource.compress(Bitmap.CompressFormat.JPEG, 100, fosSource);

            // 创建缩略图变换矩阵。
            Matrix m = new Matrix();
            m.setRectToRect(new RectF(0, 0, bmpSource.getWidth(), bmpSource.getHeight()), new RectF(0, 0, 160, 160), Matrix.ScaleToFit.CENTER);

            // 生成缩略图。
            Bitmap bmpThumb = Bitmap.createBitmap(bmpSource, 0, 0, bmpSource.getWidth(), bmpSource.getHeight(), m, true);

            imageFileThumb.createNewFile();

            FileOutputStream fosThumb = new FileOutputStream(imageFileThumb);

            // 保存缩略图。
            bmpThumb.compress(Bitmap.CompressFormat.JPEG, 60, fosThumb);

        } catch (IOException e) {
            e.printStackTrace();
        }
        ImageMessage imgMsg = ImageMessage.obtain(Uri.fromFile(imageFileThumb), Uri.fromFile(imageFileSource));
        RongIMClient.getInstance().sendImageMessage(conversationTypes.get(i), targetId, imgMsg, pushContent, pushData, new RongIMClient.SendImageMessageCallback() {
            @Override
            public void onAttached(Message message) {
                //保存数据库成功
            }

            @Override
            public void onError(Message message, RongIMClient.ErrorCode code) {
                promise.reject(code.getMessage());
            }

            @Override
            public void onSuccess(Message message) {
                promise.resolve(message);
            }

            @Override
            public void onProgress(Message message, int progress) {
                //发送进度
            }
        });
    }

    //获取未读消息数
    @ReactMethod
    public void getTotalUnreadCount(final Promise promise) {
        RongIMClient.getInstance().getTotalUnreadCount(new RongIMClient.ResultCallback<Integer>() {
            @Override
            public void onSuccess(Integer integer) {
                int totalUnreadCount = integer;
                //开发者根据自己需求自行处理接下来的逻辑
                promise.resolve(totalUnreadCount);
            }

            @Override
            public void onError(RongIMClient.ErrorCode errorCode) {
                promise.reject(errorCode.getMessage());
            }
        });
    }

    /**
     * 获取某个会话内未读消息条数
     * conversationType 会话类型
     * targetId         会话目标ID
     */
    @ReactMethod
    public void getUnreadCount(int i, String targetId, final Promise promise) {
        RongIMClient.getInstance().getUnreadCount(conversationTypes.get(i), targetId,
                new RongIMClient.ResultCallback<Integer>() {
                    @Override
                    public void onSuccess(Integer integer) {
                        int unreadCount = integer;
                        //开发者根据自己需求自行处理接下来的逻辑
                        promise.resolve(unreadCount);
                    }

                    @Override
                    public void onError(RongIMClient.ErrorCode errorCode) {
                        promise.reject(errorCode.getMessage());
                    }
                });
    }

    /**
     * 获取某个类型的会话中所有的未读消息条数
     * conversationType 会话类型
     */
    @ReactMethod
    public void getUnreadCountType(int i, final Promise promise) {
        RongIMClient.getInstance().getUnreadCount(new RongIMClient.ResultCallback<Integer>() {
            @Override
            public void onSuccess(Integer integer) {
                int unreadCount = integer;
                //开发者根据自己需求自行处理接下来的逻辑
                promise.resolve(unreadCount);
            }

            @Override
            public void onError(RongIMClient.ErrorCode errorCode) {
                promise.reject(errorCode.getMessage());
            }
        }, conversationTypes.get(i));
    }

    /**
     * 清除某个会话中的未读消息数
     * conversationType 会话类型
     * targetId         会话目标ID
     */
    @ReactMethod
    public void clearMessagesUnreadStatus(int i, String targetId, final Promise promise) {
        RongIMClient.getInstance().clearMessagesUnreadStatus(conversationTypes.get(i), targetId, new RongIMClient.ResultCallback<Boolean>() {
            @Override
            public void onSuccess(Boolean aBoolean) {
                promise.resolve(aBoolean);
            }

            @Override
            public void onError(RongIMClient.ErrorCode errorCode) {
                promise.reject(errorCode.getMessage());
            }
        });
    }

    //获取会话列表
    @ReactMethod
    public void getConversationList(final Promise promise) {
        RongIMClient.getInstance().getConversationList(new RongIMClient.ResultCallback<List<Conversation>>() {
            @Override
            public void onSuccess(List<Conversation> conversations) {
                WritableArray list = Arguments.createArray();
                if (conversations != null) {
                    for (int i = 0; i < conversations.size(); i++) {
                        Conversation c = conversations.get(i);
                        WritableMap map = Arguments.createMap();
                        map.putString("title", c.getConversationTitle());
                        map.putInt("lastId", c.getLatestMessageId());

                        map.putString("objectName", c.getObjectName());
                        map.putString("protraitUrl", c.getPortraitUrl());
                        map.putInt("reaceivedTime", (int) c.getReceivedTime());
                        map.putString("senderUserId", c.getSenderUserId());
                        map.putString("senderUserName", c.getSenderUserName());
                        map.putInt("sendTime", (int) c.getSentTime());
                        map.putString("targetId", c.getTargetId());
                        map.putInt("unreadMessageCount", c.getUnreadMessageCount());
                        byte[] b = c.getLatestMessage().encode();
                        String jsonStr = null;
                        String content = "";
                        JSONObject jsonObj;
                        try {
                            jsonStr = new String(b, "UTF-8");
                        } catch (UnsupportedEncodingException e1) {

                        }
                        try {
                            jsonObj = new JSONObject(jsonStr);
                            if (jsonObj.has("content"))
                                content = jsonObj.optString("content");

                        } catch (JSONException e) {

                        }
                        map.putInt("state", c.getReceivedStatus().getFlag());
                        map.putInt("conversationType", c.getConversationType().getValue());
                        map.putString("content", content);
                        map.putBoolean("isTop", c.isTop());
                        list.pushMap(map);

                    }
                }
                Log.e("onSuccess", list.toString());
                //console.log(list);
                promise.resolve(list);
            }

            @Override
            public void onError(RongIMClient.ErrorCode errorCode) {
                promise.resolve(errorCode);
            }
        });
    }

    /**
     * 根据会话类型的目标 Id，回调方式获取最新的 N 条消息实体。
     *
     * @param i        会话类型。
     * @param targetId 目标 Id。根据不同的 conversationType，可能是用户 Id、讨论组 Id、群组 Id 或聊天室 Id。
     * @param count    要获取的消息数量。
     * @param promise  获取最新消息记录的回调，按照时间顺序从新到旧排列。
     */
    @ReactMethod
    public void getLatestMessages(int i, String targetId, int count, final Promise promise) {
        RongIMClient.getInstance().getLatestMessages(conversationTypes.get(i), targetId, count, new RongIMClient.ResultCallback<List<Message>>() {
            @Override
            public void onSuccess(List<Message> message) {
                WritableArray list = Arguments.createArray();
                for (int i = 0; i < message.size(); i++) {
                    Message msg = message.get(i);
                    WritableMap map = Arguments.createMap();
                    map.putString("targetId", msg.getTargetId());
                    map.putInt("sendTime", (int) msg.getSentTime());
                    map.putString("sendUserId", msg.getSenderUserId());
                    map.putString("uniqueId", msg.getUId());
                    map.putInt("receivedTime", (int) msg.getReceivedTime());
                    map.putInt("messageId", msg.getMessageId());
                    map.putString("extra", msg.getExtra());
                    map.putInt("conversationType", msg.getConversationType().getValue());
                    map.putString("text", msg.getContent().encode().toString());
                    map.putString("objectName", msg.getObjectName());
                    map.putInt("state", msg.getSentStatus().getValue());
                    list.pushMap(map);
                }
                promise.resolve(list);
            }

            @Override
            public void onError(RongIMClient.ErrorCode errorCode) {
                promise.resolve(errorCode);
            }
        });
    }

    public static String getRealFilePath(final Context context, final Uri uri ) {
        if ( null == uri ) return null;
        final String scheme = uri.getScheme();
        String data = null;
        if ( scheme == null )
            data = uri.getPath();
        else if ( ContentResolver.SCHEME_FILE.equals( scheme ) ) {
            data = uri.getPath();
        } else if ( ContentResolver.SCHEME_CONTENT.equals( scheme ) ) {
            Cursor cursor = context.getContentResolver().query( uri, new String[] { MediaStore.Images.ImageColumns.DATA }, null, null, null );
            if ( null != cursor ) {
                if ( cursor.moveToFirst() ) {
                    int index = cursor.getColumnIndex( MediaStore.Images.ImageColumns.DATA );
                    if ( index > -1 ) {
                        data = cursor.getString( index );
                    }
                }
                cursor.close();
            }
        }
        return data;
    }



    /**
     * 获取会话中，从指定消息之前、指定数量的最新消息实体
     *
     * @param i               会话类型。不支持传入 ConversationType.CHATROOM。
     * @param targetId        目标 Id。根据不同的 conversationType，可能是用户 Id、讨论组 Id、群组 Id。
     * @param oldestMessageId 最后一条消息的 Id，获取此消息之前的 count 条消息，没有消息第一次调用应设置为:-1。
     * @param count           要获取的消息数量。
     * @param promise         获取历史消息记录的回调，按照时间顺序从新到旧排列。
     */
    @ReactMethod
    public void getHistoryMessages(int i, final String targetId, int oldestMessageId, int count, final Promise promise) {

        RongIMClient.getInstance().getHistoryMessages(conversationTypes.get(i), targetId, oldestMessageId, count, new RongIMClient.ResultCallback<List<Message>>() {
            @Override
            public void onSuccess(List<Message> messages) {
                WritableArray list = Arguments.createArray();
                if (messages != null) {
                    for (int i = messages.size()-1; i >0; i--) {
                        Message msg = messages.get(i);
                        WritableMap map = Arguments.createMap();
                        WritableMap image = Arguments.createMap();
                        if (msg.getSenderUserId().equals(targetId)) {
                            map.putString("position", "left");
                        } else {
                            map.putString("position", "right");
                        }
                        map.putString("targetId", msg.getTargetId());
                        map.putInt("date", (int) msg.getSentTime());
                        map.putString("sendUserId", msg.getSenderUserId());
                        map.putString("uniqueId", msg.getUId());
                        map.putInt("receivedTime", (int) msg.getReceivedTime());
                        UserInfo userinfo=msg.getContent().getUserInfo();
                        String name="";
                        String uriString="";
                        if(userinfo!=null){
                            name=userinfo.getName();
                            if(name==null){
                                name="未知用户";
                            }
                            Uri uri=userinfo.getPortraitUri();
                            if(uri!=null){
                                uriString=getRealFilePath(reactContext,uri);
                            }
                        }

                        map.putString("name",name);
                        image.putString("uri",uriString);
                        map.putMap("image", image);
                        byte[] b = msg.getContent().encode();
                        String jsonStr = null;
                        String content = "";
                        JSONObject jsonObj;
                        try {
                            jsonStr = new String(b, "UTF-8");
                        } catch (UnsupportedEncodingException e1) {

                        }
                        try {
                            jsonObj = new JSONObject(jsonStr);
                            if (jsonObj.has("content"))
                                content = jsonObj.optString("content");

                        } catch (JSONException e) {

                        }
                        map.putString("text", content);
                        map.putInt("state",msg.getReceivedStatus().getFlag());
                        map.putInt("messageId", msg.getMessageId());
                        map.putString("extra", msg.getExtra());
                        map.putInt("conversationType", msg.getConversationType().getValue());
                        map.putString("objectName", msg.getObjectName());
                        map.putInt("state", msg.getSentStatus().getValue());
                        Log.e("onSuccess", map.toString());
                        list.pushMap(map);
                    }
                }

                promise.resolve(list);
            }

            @Override
            public void onError(RongIMClient.ErrorCode errorCode) {
                promise.reject(errorCode.getMessage());
            }
        });
    }

    ;

    /**
     * 获取会话中，从指定消息之前、指定数量的、指定消息类型的最新消息实体
     *
     * @param i               会话类型。不支持传入 ConversationType.CHATROOM。
     * @param targetId        目标 Id。根据不同的 conversationType，可能是用户 Id、讨论组 Id、群组 Id 或聊天室 Id。
     * @param oldestMessageId 最后一条消息的 Id，获取此消息之前的 count 条消息,没有消息第一次调用应设置为:-1。
     * @param count           要获取的消息数量
     * @param promise         获取历史消息记录的回调，按照时间顺序从新到旧排列。
     */
    @ReactMethod
    public void getHistoryMessagesType(int i, final String targetId, int oldestMessageId, int count, final Promise promise) {
        RongIMClient.getInstance().getHistoryMessages(conversationTypes.get(i), targetId, oldestMessageId, count, new RongIMClient.ResultCallback<List<Message>>() {
            @Override
            public void onSuccess(List<Message> messages) {
                WritableArray list = Arguments.createArray();
                for (int i = messages.size()-1; i >0; i--) {
                    Message msg = messages.get(i);
                    WritableMap map = Arguments.createMap();
                    WritableMap image = Arguments.createMap();
                    if (msg.getSenderUserId().equals(targetId)) {
                        map.putString("position", "left");
                    } else {
                        map.putString("position", "right");
                    }
                    map.putString("targetId", msg.getTargetId());
                    map.putInt("date", (int) msg.getSentTime());
                    map.putString("sendUserId", msg.getSenderUserId());
                    map.putString("uniqueId", msg.getUId());
                    map.putInt("receivedTime", (int) msg.getReceivedTime());
                    UserInfo userinfo=msg.getContent().getUserInfo();
                    String name="";
                    String uriString="";
                    if(userinfo!=null){
                        name=userinfo.getName();
                        if(name==null){
                            name="未知用户";
                        }
                        Uri uri=userinfo.getPortraitUri();
                        if(uri!=null){
                            uriString=getRealFilePath(reactContext,uri);
                        }
                    }

                    map.putString("name",name);
                    image.putString("uri",uriString);
                    map.putMap("image", image);

                    byte[] b = msg.getContent().encode();
                    String jsonStr = null;
                    String content = "";
                    JSONObject jsonObj;
                    try {
                        jsonStr = new String(b, "UTF-8");
                    } catch (UnsupportedEncodingException e1) {

                    }
                    try {
                        jsonObj = new JSONObject(jsonStr);
                        if (jsonObj.has("content"))
                            content = jsonObj.optString("content");

                    } catch (JSONException e) {

                    }
                    map.putString("text", content);
                    map.putInt("state",msg.getReceivedStatus().getFlag());
                    map.putInt("messageId", msg.getMessageId());
                    map.putString("extra", msg.getExtra());
                    map.putInt("conversationType", msg.getConversationType().getValue());
                    map.putString("objectName", msg.getObjectName());
                    map.putInt("state", msg.getSentStatus().getValue());
                    Log.e("onSuccess", map.toString());
                    list.pushMap(map);
                }
                promise.resolve(list);
            }

            @Override
            public void onError(RongIMClient.ErrorCode errorCode) {
                promise.reject(errorCode.getMessage());
            }
        });
    }

    /**
     * 接收未读消息的监听器。
     */
    private class MyReceiveUnreadCountChangedListener implements RongIM.OnReceiveUnreadCountChangedListener {

        /**
         * @param count           未读消息数。
         */
        @Override
        public void onMessageIncreased(int count) {

        }
    }
    private class MyConnectionStatusListener implements RongIMClient.ConnectionStatusListener {

        @Override
        public void onChanged(ConnectionStatus connectionStatus) {

            switch (connectionStatus){

                case CONNECTED://连接成功。

                    break;
                case DISCONNECTED://断开连接。

                    break;
                case CONNECTING://连接中。

                    break;
                case NETWORK_UNAVAILABLE://网络不可用。

                    break;
                case KICKED_OFFLINE_BY_OTHER_CLIENT://用户账户在其他设备登录，本机会被踢掉线

                    break;
            }
        }
    }
    private class MyReceiveMessageListener implements RongIMClient.OnReceiveMessageListener {

        /**
         * 收到消息的处理。
         *
         * @param message 收到的消息实体。
         * @param left    剩余未拉取消息数目。
         * @return
         */
        @Override
        public boolean onReceived(Message message, int left) {
            Log.e("onSuccess", message.getContent() + "");
            Message msg = message;
            WritableMap map = Arguments.createMap();
            map.putString("position", "left");
            map.putString("targetId", msg.getTargetId());
            map.putInt("date", (int) msg.getSentTime());
            map.putString("sendUserId", msg.getSenderUserId());
            map.putString("uniqueId", msg.getUId());
            map.putInt("receivedTime", (int) msg.getReceivedTime());
            map.putInt("messageId", msg.getMessageId());
            map.putString("extra", msg.getExtra());
            map.putInt("conversationType", msg.getConversationType().getValue());
            String name="";
            String uriString="";
            map.putString("name",name);
            WritableMap image = Arguments.createMap();
            image.putString("uri",uriString);
            map.putMap("image", image);
            byte[] b = msg.getContent().encode();
            String jsonStr = null;
            String content = "";
            JSONObject jsonObj;
            try {
                jsonStr = new String(b, "UTF-8");
            } catch (UnsupportedEncodingException e1) {

            }
            try {
                jsonObj = new JSONObject(jsonStr);
                if (jsonObj.has("content"))
                    content = jsonObj.optString("content");

            } catch (JSONException e) {

            }
            map.putString("text", content);
            map.putString("objectName", msg.getObjectName());
            map.putInt("state", msg.getSentStatus().getValue());
            sendEvent(reactContext,"updateMessage",map);
            return false;
        }
    }
}
