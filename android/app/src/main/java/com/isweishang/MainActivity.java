package com.isweishang;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;

import com.facebook.react.ReactActivity;
import com.image.zoom.ReactImageZoom;
import com.eguma.barcodescanner.BarcodeScanner;
import com.lwansbrough.RCTCamera.RCTCameraPackage;

import cn.jpush.android.api.JPushInterface;
import fr.bamlab.rnimageresizer.ImageResizerPackage;
import cn.reactnative.modules.update.UpdatePackage;

import com.imagepicker.ImagePickerPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

import cn.reactnative.modules.update.UpdateContext;


import java.util.Arrays;
import java.util.List;


public class MainActivity extends ReactActivity {
    private MessageReceiver mMessageReceiver;
    public static final String MESSAGE_RECEIVED_ACTION = "com.isweishang.MESSAGE_RECEIVED_ACTION";
    public static final String KEY_TITLE = "title";
    public static final String KEY_MESSAGE = "message";
    public static final String KEY_EXTRAS = "extras";
    public static boolean isForeground = false;
    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "isweishang";
    }

    /**
     * Returns whether dev mode should be enabled.
     * This enables e.g. the dev menu.
     */
    @Override
    protected boolean getUseDeveloperSupport() {

        return BuildConfig.DEBUG;
    }

    /**
     * A list of packages used by the app. If the app uses additional views
     * or modules besides the default ones, add more packages here.
     */
    @Override
    protected List<ReactPackage> getPackages() {
        return Arrays.<ReactPackage>asList(
                new MainReactPackage(),
                new ReactImageZoom(),
                new BarcodeScanner(),
                new RCTCameraPackage(),
                new ImageResizerPackage(),
                new UpdatePackage(),
               // new UmengPushPackage(),
                new ImagePickerPackage(),
                new VectorIconsPackage(),
                //new UmengSharePackage(),
                new MyReactPackage(),
                new createViewManagers()
                //new VideoPage()
        );
    }
    @Override
    protected void onResume() {
        isForeground = true;
        super.onResume();
        JPushInterface.onResume(this);
    }


    @Override
    protected void onPause() {
        isForeground = false;
        super.onPause();
        JPushInterface.onPause(this);
    }

    @Override
    protected void onDestroy() {
        unregisterReceiver(mMessageReceiver);
        super.onDestroy();
    }
    public void registerMessageReceiver() {
        mMessageReceiver = new MessageReceiver();
        IntentFilter filter = new IntentFilter();
        filter.setPriority(IntentFilter.SYSTEM_HIGH_PRIORITY);
        filter.addAction(MESSAGE_RECEIVED_ACTION);
        registerReceiver(mMessageReceiver, filter);
    }
    public class MessageReceiver extends BroadcastReceiver {

        @Override
        public void onReceive(Context context, Intent intent) {
            if (MESSAGE_RECEIVED_ACTION.equals(intent.getAction())) {
                String messge = intent.getStringExtra(KEY_MESSAGE);
                String extras = intent.getStringExtra(KEY_EXTRAS);
                StringBuilder showMsg = new StringBuilder();
                showMsg.append(KEY_MESSAGE + " : " + messge + "\n");
                if (!ExampleUtil.isEmpty(extras)) {
                    showMsg.append(KEY_EXTRAS + " : " + extras + "\n");
                }
                //setCostomMsg(showMsg.toString());
            }
        }
    }
}
