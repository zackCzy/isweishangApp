import React,{Component,PropTypes} from 'react';

import{
    Text,
    Platform
} from 'react-native';
import {
    isFirstTime,
    isRolledBack,
    packageVersion,
    currentVersion,
    checkUpdate,
    downloadUpdate,
    switchVersion,
    switchVersionLater,
    markSuccess,
    //NativeModules
} from 'react-native-update';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import Navigation from './layouts/Navigation';
import _updateConfig from './../update.json';
import * as RongIm from './services/RongIm';
const {appKey} = _updateConfig[Platform.OS];


const store = configureStore();

class App extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态

    }

    componentWillMount() {
       /* if (isFirstTime) {
            Alert.alert('提示', '这是当前版本第一次启动,是否要模拟启动失败?失败将回滚到上一版本', [
                {
                    text: '是', onPress: ()=> {
                    throw new Error('模拟启动失败,请重启应用')
                }
                },
                {
                    text: '否', onPress: ()=> {
                    markSuccess()
                }
                },
            ]);
        } else if (isRolledBack) {
            Alert.alert('提示', '刚刚更新失败了,版本被回滚.');
        }

    }

    doUpdate = info => {
        downloadUpdate(info).then(hash => {
            Alert.alert('提示', '下载完毕,是否重启应用?', [
                {
                    text: '是', onPress: ()=> {
                    switchVersion(hash);
                }
                },
                {text: '否',},
                {
                    text: '下次启动时', onPress: ()=> {
                    switchVersionLater(hash);
                }
                },
            ]);
        }).catch(err => {
            Alert.alert('提示', '更新失败.');
        });
    };
    checkUpdate = () => {
        checkUpdate(appKey).then(info => {
            if (info.expired) {
                Alert.alert('提示', '您的应用版本已更新,请前往应用商店下载新的版本', [
                    {
                        text: '确定', onPress: ()=> {
                        info.downloadUrl && Linking.openURL(info.downloadUrl)
                    }
                    },
                ]);
            } else if (info.upToDate) {
                Alert.alert('提示', '您的应用版本已是最新.');
            } else {
                Alert.alert('提示', '检查到新的版本' + info.name + ',是否下载?\n' + info.description, [
                    {
                        text: '是', onPress: ()=> {
                        this.doUpdate(info)
                    }
                    },
                    {text: '否',},
                ]);
            }
        }).catch(err => {
            Alert.alert('提示', '更新失败.');
        });*/
    };

    render() {
        //NativeModules.MyIntentModule.getDataFromIntent(
        //    (successMsg) =>{
        //        alert(successMsg)
        //        //this.setState({TEXT: successMsg,}); //状态改变的话重新绘制界面
        //    },
        //    (erroMsg) => {alert(erroMsg)}
        //);
        return (
            <Provider store={store}>
                <Navigation/>
            </Provider>
        );
    }
}


export default App;
