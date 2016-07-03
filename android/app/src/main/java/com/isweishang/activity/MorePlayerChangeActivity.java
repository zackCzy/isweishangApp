package com.isweishang.activity;

import android.app.Activity;
import android.graphics.SurfaceTexture;
import android.os.Bundle;
import android.view.Surface;
import android.view.TextureView;
import android.view.View;
import android.widget.RelativeLayout;
import android.widget.RelativeLayout.LayoutParams;

import com.isweishang.R;
import com.lecloud.leutils.PxUtils;
import com.letv.controller.LetvPlayer;
import com.letv.controller.PlayContext;
import com.letv.controller.PlayProxy;
import com.letv.universal.iplay.EventPlayProxy;
import com.letv.universal.iplay.IPlayer;
import com.letv.universal.iplay.OnPlayStateListener;

/**
 * Created by gaolinhua on 2016/4/28.
 */
public class MorePlayerChangeActivity extends Activity implements View.OnClickListener {
    private LetvPlayer assistPlayer;
    private LetvPlayer mainPlayer;
    private TextureView mainSurface;
    private TextureView assistSurface;
    private boolean mainSuspend = false;
    private boolean assistSuspend = false;
    private boolean isBack = false;
    private PlayContext mMainPlayerContext;
    private PlayContext mAssistPlayerContext;

    private boolean mIsSwitched = false;
    private RelativeLayout mRoot;
    private LayoutParams mBigLayoutParams;
    private LayoutParams mSmallLayoutParams;

    private TextureView.SurfaceTextureListener mMainTextureListener = new TextureView.SurfaceTextureListener() {
        @Override
        public void onSurfaceTextureAvailable(SurfaceTexture surface, int width, int height) {
            if (mainPlayer != null) {
                mainPlayer.setDisplay(new Surface(surface));
                mainPlayer.regain();
            }
        }

        @Override
        public void onSurfaceTextureSizeChanged(SurfaceTexture surface, int width, int height) {

        }

        @Override
        public boolean onSurfaceTextureDestroyed(SurfaceTexture surface) {
            if (mainPlayer != null) {
                mainPlayer.suspend();
            }
            return true;
        }

        @Override
        public void onSurfaceTextureUpdated(SurfaceTexture surface) {
            mainPlayer.setDisplay(new Surface(surface));
        }
    };

    private TextureView.SurfaceTextureListener mAssistTextureListener = new TextureView.SurfaceTextureListener() {
        @Override
        public void onSurfaceTextureAvailable(SurfaceTexture surface, int width, int height) {
            if (assistPlayer != null) {
                assistPlayer.setDisplay(new Surface(surface));
                assistPlayer.regain();
            }
        }

        @Override
        public void onSurfaceTextureSizeChanged(SurfaceTexture surface, int width, int height) {

        }

        @Override
        public boolean onSurfaceTextureDestroyed(SurfaceTexture surface) {
            if (assistPlayer != null) {
                assistPlayer.suspend();
            }
            return true;
        }

        @Override
        public void onSurfaceTextureUpdated(SurfaceTexture surface) {
            assistPlayer.setDisplay(new Surface(surface));
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.two_player_switch);
        initView();
        initPlayer();
    }

    private void initPlayer() {
        mainPlayer = new LetvPlayer();
        assistPlayer = new LetvPlayer();
        mMainPlayerContext = new PlayContext(this);
        mAssistPlayerContext = new PlayContext(this);
        mMainPlayerContext.setVideoContentView(mainSurface);
        mAssistPlayerContext.setVideoContentView(assistSurface);
        mAssistPlayerContext.setUsePlayerProxy(true);
        mainPlayer.setPlayContext(mMainPlayerContext);
        assistPlayer.setPlayContext(mAssistPlayerContext);

        mainPlayer.init();
        assistPlayer.init();

        Bundle bundle = new Bundle();
        bundle.putInt(PlayProxy.PLAY_MODE, EventPlayProxy.PLAYER_VOD);
        bundle.putString(PlayProxy.PLAY_UUID, "603143efd0");
        bundle.putString(PlayProxy.PLAY_VUID, "2d89a1d5c7");
        mainPlayer.setParameter(mainPlayer.getPlayerId(), bundle);
        Bundle bundle1 = new Bundle();
        bundle1.putInt(PlayProxy.PLAY_MODE, EventPlayProxy.PLAYER_VOD);
        bundle1.putString(PlayProxy.PLAY_UUID, "hxn7psp8ot");
        bundle1.putString(PlayProxy.PLAY_VUID, "49bf3407cb");
        assistPlayer.setParameter(assistPlayer.getPlayerId(), bundle1);

        mainPlayer.setOnPlayStateListener(mainListener);
        assistPlayer.setOnPlayStateListener(assistListener);

        mainSurface.post(new Runnable() {

            @Override
            public void run() {
                mainPlayer.prepareAsync();
            }
        });
        assistSurface.post(new Runnable() {

            @Override
            public void run() {
                assistPlayer.prepareAsync();
            }
        });
    }

    private void initView() {
        mRoot = (RelativeLayout) findViewById(R.id.root);
        mainSurface = new TextureView(this);
        assistSurface = new TextureView(this);
        mainSurface.setSurfaceTextureListener(mMainTextureListener);
        assistSurface.setSurfaceTextureListener(mAssistTextureListener);

        mSmallLayoutParams = new LayoutParams(
                PxUtils.dip2px(this, 160), PxUtils.dip2px(this, 90));
        mSmallLayoutParams.addRule(RelativeLayout.ALIGN_PARENT_RIGHT |
                RelativeLayout.ALIGN_PARENT_TOP);
        int topMargin = PxUtils.dip2px(this, 10);
        int rightMargin = PxUtils.dip2px(this, 20);
        mSmallLayoutParams.setMargins(0, topMargin, rightMargin, 0);
        mBigLayoutParams = new LayoutParams(
                LayoutParams.MATCH_PARENT,
                LayoutParams.MATCH_PARENT);
        mainSurface.setLayoutParams(mBigLayoutParams);
        assistSurface.setLayoutParams(mSmallLayoutParams);
        mainSurface.setOnClickListener(this);
        assistSurface.setOnClickListener(this);
        mainSurface.setKeepScreenOn(true);
        mRoot.addView(mainSurface);
        mRoot.addView(assistSurface);
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (isBack) {
            if (!mainSuspend && mainPlayer != null) {
                mainPlayer.start();
            }
            if (!assistSuspend && assistPlayer != null) {
                assistPlayer.start();
            }
        }
        isBack = false;
    }

    @Override
    protected void onPause() {
        super.onPause();
        isBack = true;
        if (!mainSuspend && mainPlayer != null) mainPlayer.pause();
        if (!assistSuspend && assistPlayer != null) assistPlayer.pause();
    }

    protected void onDestroy() {
        super.onDestroy();
        if (mainPlayer != null) {
            mainPlayer.stop();
            mainPlayer.release();
        }
        if (assistPlayer != null) {
            assistPlayer.stop();
            assistPlayer.release();
        }
    }

    private OnPlayStateListener mainListener = new OnPlayStateListener() {

        @Override
        public void videoState(int state, Bundle bundle) {
            switch (state) {
                case IPlayer.MEDIA_EVENT_PREPARE_COMPLETE:
                    mainPlayer.start();
                    break;
                case IPlayer.MEDIA_EVENT_VIDEO_SIZE:
                    double ratio = Math.min(((double) mainSurface.getWidth()) / mainPlayer.getVideoWidth(), ((double) mainSurface.getHeight()) / mainPlayer.getVideoHeight());
                    LayoutParams params = new LayoutParams((int) (ratio * mainPlayer.getVideoWidth()), (int) (ratio * mainPlayer.getVideoHeight()));
                    params.addRule(RelativeLayout.CENTER_IN_PARENT);
                    mainSurface.setLayoutParams(params);
                    break;
                default:
                    break;
            }
        }
    };
    private OnPlayStateListener assistListener = new OnPlayStateListener() {

        @Override
        public void videoState(int state, Bundle bundle) {
            switch (state) {
                case IPlayer.MEDIA_EVENT_PREPARE_COMPLETE:
                    assistPlayer.start();
                    break;
                case IPlayer.MEDIA_EVENT_VIDEO_SIZE:
                    double ratio = Math.min(((double) assistSurface.getWidth()) / assistPlayer.getVideoWidth(), ((double) assistSurface.getHeight()) / assistPlayer.getVideoHeight());
                    LayoutParams params = new LayoutParams((int) (ratio * assistPlayer.getVideoWidth()), (int) (ratio * assistPlayer.getVideoHeight()));
                    params.addRule(RelativeLayout.CENTER_IN_PARENT);
                    assistSurface.setLayoutParams(params);
                    break;

                default:
                    break;
            }
        }
    };

    @Override
    public void onClick(View v) {
        if (v == mainSurface) {
            switchVideoSize();
        } else if (v == assistSurface) {
            switchVideoSize();
        }
    }

    private void switchVideoSize() {
        if (!mIsSwitched) {
            mainSurface.bringToFront();
            mainSurface.setLayoutParams(mSmallLayoutParams);
            assistSurface.setLayoutParams(mBigLayoutParams);
        } else {
            assistSurface.bringToFront();
            mainSurface.setLayoutParams(mBigLayoutParams);
            assistSurface.setLayoutParams(mSmallLayoutParams);
        }
        mIsSwitched = !mIsSwitched;
    }
}
