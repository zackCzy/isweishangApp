package com.isweishang;
import android.app.ActivityManager;
import android.content.Context;

import com.isweishang.handler.CrashHandler;
import com.lecloud.config.LeCloudPlayerConfig;
import com.letv.proxy.LeCloudProxy;
import com.liuchungui.react_native_umeng_push.UmengPushApplication;

import java.util.List;

import cn.sharesdk.framework.ShareSDK;
import io.rong.imkit.RongIM;

public class Application extends UmengPushApplication {

    public static String getProcessName(Context cxt, int pid) {
        ActivityManager am = (ActivityManager) cxt.getSystemService(Context.ACTIVITY_SERVICE);
        List<ActivityManager.RunningAppProcessInfo> runningApps = am.getRunningAppProcesses();
        if (runningApps != null) {
            for (ActivityManager.RunningAppProcessInfo procInfo : runningApps) {
                if (procInfo.pid == pid) {
                    return procInfo.processName;
                }
            }
        }
        return null;
    }

    @Override
    public void onCreate(){
        super.onCreate();
        RongIM.init(this);
        ShareSDK.initSDK(this);
        String processName = getProcessName(this, android.os.Process.myPid());
        if (getApplicationInfo().packageName.equals(processName)) {
            //TODO CrashHandler是一个抓取崩溃log的工具类（可选）
            CrashHandler.getInstance(this);
            LeCloudPlayerConfig.getInstance().setPrintSdcardLog(true).setIsApp().setUseLiveToVod(true);//setUseLiveToVod 使用直播转点播功能 (直播结束后按照点播方式播放)
            LeCloudProxy.init(getApplicationContext());
        }
    }

}
