package com.isweishang.reactPage;

import android.os.Bundle;
import android.text.TextUtils;
import android.view.SurfaceHolder;
import android.view.SurfaceView;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.isweishang.utils.GetDeviceInfo;
import com.isweishang.utils.LetvNormalAndPanoHelper;
import com.isweishang.utils.LetvParamsUtils;
import com.letv.controller.LetvPlayer;
import com.letv.controller.PlayContext;
import com.letv.universal.iplay.ISplayer;
import com.letv.universal.play.util.PlayerParamsHelper;

/**
 * Created by zack on 16/6/28.
 */

public class LetvLiveRtc extends SimpleViewManager<SurfaceView> {
    public final static String DATA = "data";
    public static final String REACT_CLASS = "RtcLetvLive";

    private ISplayer player;
    private String path = "";
    private PlayContext playContext;
    private SurfaceView videoView;
    private Bundle mBundle;
    private long lastPosition;
    private TextView console;

    // surfaceView的生命周期
    private LetvNormalAndPanoHelper playHelper;
    private SurfaceHolder.Callback surfaceCallback = new SurfaceHolder.Callback() {
        @Override
        public void surfaceDestroyed(SurfaceHolder holder) {
            stopAndRelease();
        }

        @Override
        public void surfaceCreated(SurfaceHolder holder) {
            if (player != null) {
                player.setDisplay(holder.getSurface());
            }
        }

        @Override
        public void surfaceChanged(SurfaceHolder holder, int format, int width, int height) {
            if (player != null) {
                PlayerParamsHelper.setViewSizeChange(player, width, height);
            }
        }
    };
    @Override
    public String getName() {
        return REACT_CLASS;
    }
    @Override
    public SurfaceView createViewInstance(ThemedReactContext context) {
        playContext = new PlayContext(context);
        playContext.setUsePlayerProxy(TextUtils.isEmpty(path));
        player = new LetvPlayer();
        player.setPlayContext(playContext); //关联playContext
        addVideoView(context);
        mBundle=LetvParamsUtils.setActionLiveParams("A2016062000000dp", false);
        player.setParameter(player.getPlayerId(), mBundle);
        player.prepareAsync();
        return videoView;
    }

    /**
     * 停止和释放播放器
     */
    public void stopAndRelease() {
        if (player != null) {
            lastPosition = player.getCurrentPosition();
            player.stop();
            player.reset();
            player.release();
            player = null;
        }
    }
    private SurfaceView addVideoView(ThemedReactContext context) {
        videoView.getHolder().addCallback(surfaceCallback);
        int width = GetDeviceInfo.getScreenWidth(context);
        int height = width * 9/16;
        RelativeLayout.LayoutParams params = new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.MATCH_PARENT, RelativeLayout.LayoutParams.MATCH_PARENT);
        if (player.getVideoWidth() != 0 && player.getVideoHeight() == 0) {
            double ratio = Math.min(((double) width / player.getVideoWidth()), ((double) height / player.getVideoHeight()));
            params = new RelativeLayout.LayoutParams((int) ratio * player.getVideoWidth(), (int) ratio * player.getVideoHeight());
        }
       return videoView;
    }
}