import React,{Component,PropTypes} from 'react';

import{
    AppRegistry,
    StyleSheet,
    View,
    Text
} from 'react-native';
import App from './src';
//import UmengPush from 'react-native-umeng-push';
//
//UmengPush.getDeviceToken(deviceToken => {
//    console.log(deviceToken);
//    alert(deviceToken);
//});
//UmengPush.didReceiveMessage(message => {
//    alert("didReceiveMessage");
//    console.log("didReceiveMessage:", message);
//});
//UmengPush.didOpenMessage(message => {
//    alert("didOpenMessage");
//    console.log("didOpenMessage:", message);
//});

//React.NativeModules.MyIntentModule.getDataFromIntent(
//    (successMsg) =>{
//        alert(successMsg)
//        //this.setState({TEXT: successMsg,}); //状态改变的话重新绘制界面
//    },
//    (erroMsg) => {alert(erroMsg)}
//);
AppRegistry.registerComponent('isweishang', () => App);
