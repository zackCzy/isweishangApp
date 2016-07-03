package com.isweishang.reactPage;

import android.graphics.Color;
import android.util.Log;
import android.view.View;
import android.widget.TextView;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;

import java.util.ArrayList;

import cn.com.video.venvy.param.JjVideoView;
import cn.com.video.venvy.param.OnJjBufferCompleteListener;
import cn.com.video.venvy.param.OnJjBufferStartListener;
import cn.com.video.venvy.param.OnJjBufferingUpdateListener;
import cn.com.video.venvy.param.OnJjOpenStartListener;
import cn.com.video.venvy.param.OnJjOpenSuccessListener;
import cn.com.video.venvy.param.OnJjOutsideLinkClickListener;
import cn.com.video.venvy.param.VideoJjMediaContoller;

/**
 * Created by zack on 16/6/28.
 */

public class VedioRtc extends SimpleViewManager<JjVideoView> {
    public final static String DATA = "data";
    public static final String REACT_CLASS = "RtcVedio";
    private JjVideoView mVideoView;//
    private View mLoadBufferView;// //
    private TextView mLoadBufferTextView;// //
    private View mLoadView;// /
    private TextView mLoadText;// /
    private View ContentView;
    String mUrl = "/storage/emulated/0/Android/json.txt";
    String mPath = "/storage/emulated/0/Android/28932D2E0132471294162C90B502E32F12BF71FA.mp4";
    String mRtmp = "rtmp://live.hkstv.hk.lxdns.com/live/hks";

    @Override
    public String getName() {
        return REACT_CLASS;
    }
    @Override
    public JjVideoView createViewInstance(ThemedReactContext context) {

        mVideoView = new JjVideoView(context);
        mVideoView.setMinimumWidth(300);
        mVideoView.setMinimumHeight(300);
        mLoadView = new View(context);
        mLoadText = new TextView(context);
        mLoadBufferView = new View(context);
        mLoadBufferTextView = new TextView(context);
        mVideoView.setMediaController(new VideoJjMediaContoller(context.getBaseContext(), true));
        mLoadBufferTextView.setTextColor(Color.RED);
        ArrayList<View> views=new ArrayList();
        views.add(mVideoView);
        views.add(mLoadView);
        views.add(mLoadBufferView);
        views.add(mLoadBufferTextView);
        //ContentView.addChildrenForAccessibility(views);
        /***
         * 用户自定义的外链 可 获取外链点击时间
         */
        mVideoView
                .setOnJjOutsideLinkClickListener(new OnJjOutsideLinkClickListener() {

                    @Override
                    public void onJjOutsideLinkClick(String arg0) {
                        // TODO Auto-generated method stub
                    }

                    @Override
                    public void onJjOutsideLinkClose() {
                        // TODO Auto-generated method stub

                    }
                });
        /***
         * 设置缓冲
         */
        mVideoView.setMediaBufferingView(mLoadBufferView);
        /***
         * 视频开始加载数据
         */
        mVideoView.setOnJjOpenStart(new OnJjOpenStartListener() {

            @Override
            public void onJjOpenStart(String arg0) {
                mLoadText.setText(arg0);
            }
        });
        /***
         * 视频开始播放
         */
        mVideoView.setOnJjOpenSuccess(new OnJjOpenSuccessListener() {

            @Override
            public void onJjOpenSuccess() {
                mLoadView.setVisibility(View.GONE);
            }
        });
        // 缓冲开始
        mVideoView.setOnJjBufferStart(new OnJjBufferStartListener() {

            @Override
            public void onJjBufferStartListener(int arg0) {
                Log.e("Video++", "====================缓冲值=====" + arg0);
            }
        });
        mVideoView
                .setOnJjBufferingUpdateListener(new OnJjBufferingUpdateListener() {

                    @Override
                    public void onJjBufferingUpdate(int arg1) {
                        // TODO Auto-generated method stub
                        if (mLoadBufferView.getVisibility() == View.VISIBLE) {
                            mLoadBufferTextView.setText(String
                                    .valueOf(mVideoView.getBufferPercentage())
                                    + "%");
                            Log.e("Video++", "====================缓冲值2====="
                                    + arg1);
                        }
                    }
                });
        // 缓冲完成
        mVideoView.setOnJjBufferComplete(new OnJjBufferCompleteListener() {

            @Override
            public void onJjBufferCompleteListener(int arg0) {
                // TODO Auto-generated method stub

            }
        });
        /***
         * 注意VideoView 要调用下面方法 配置你用户信息
         */
        mVideoView.setVideoJjAppKey("NJBPvObVb");
        mVideoView.setVideoJjPageName("com.isweishang");
        // mVideoView.setMediaCodecEnabled(true);// 是否开启 硬解 硬解对一些手机有限制
        // 判断是否源 0 代表 8大视频网站url 3代表自己服务器的视频源 2代表直播地址 1代表本地视频(手机上的视频源),4特殊需求
        mVideoView.setVideoJjType(3);
        /***
         * 视频标签显示的时间 默认显示5000毫秒 可设置 传入值 long类型 毫秒
         */
        // 参数代表是否记录视频播放位置 默认false不记录 true代表第二次或多次进入，直接跳转到上次退出的时间点开始播放
        // mVideoView.setVideoJjSaveExitTime(false);
        /***
         * 指定时间开始播放 毫秒
         */
        //mVideoView.setResourceVideo("http://7xr5j6.com1.z0.glb.clouddn.com/hunantv0129.mp4?v=3");

        return mVideoView;
    }


}