package com.isweishang;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.isweishang.reactModule.MobShare;
import com.isweishang.reactModule.MyIntentModule;
import com.isweishang.reactModule.PushModule;
import com.isweishang.reactModule.RongyunIm;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Created by zack on 16/6/21.
 */
public class MyReactPackage implements ReactPackage {

    @Override
    public List<Class<? extends JavaScriptModule>> createJSModules() {
        return Collections.emptyList();
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }

    @Override
    public List<NativeModule> createNativeModules(
            ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();

        modules.add(new MyIntentModule(reactContext));
        modules.add(new RongyunIm(reactContext));
        modules.add(new MobShare(reactContext));
        modules.add(new PushModule(reactContext));
        return modules;
    }

}
