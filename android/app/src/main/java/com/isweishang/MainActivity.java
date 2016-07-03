package com.isweishang;

import com.facebook.react.ReactActivity;
import com.image.zoom.ReactImageZoom;
import com.eguma.barcodescanner.BarcodeScanner;
import com.lwansbrough.RCTCamera.RCTCameraPackage;

import fr.bamlab.rnimageresizer.ImageResizerPackage;
import cn.reactnative.modules.update.UpdatePackage;

import com.liuchungui.react_native_umeng_push.UmengPushPackage;
import com.imagepicker.ImagePickerPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

import cn.reactnative.modules.update.UpdateContext;
//import com.lixiang.rn_umeng_share.*;

import java.util.Arrays;
import java.util.List;


public class MainActivity extends ReactActivity {

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
                new UmengPushPackage(),
                new ImagePickerPackage(),
                new VectorIconsPackage(),
                //new UmengSharePackage(),
                new MyReactPackage(),
                new createViewManagers()
                //new VideoPage()
        );
    }
}
