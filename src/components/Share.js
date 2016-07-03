/**
 * Created by zack on 16/5/31.
 */
import  React,{Component}  from 'react';
import {
    View,
    AppRegistry,
    StyleSheet,
    Animated,
    Easing,
    Dimensions,
    Platform,
    PixelRatio,
    TouchableOpacity,
    Text
} from 'react-native';
const {height, width} = Dimensions.get('window');
import * as MobService from '../services/MobService';

const topHeight = 300;
let _animateHandlerShow;
let _animateHandlerHide;
export default class Share extends Component {
    constructor(props) {
        super(props);
        this.state = {
            opacityAnmValue: new Animated.Value(0), // init opacity 0
            bounceValue: new Animated.Value(0),
            shareObj: this.props.shareObj,
            show:false
        };
    }

    trigger(){
        if(!this.state.show){
            this.show();
        }else{
            this.hide();
        }
        this.setState({
            show:!this.state.show
        });
    }
    hide() {
        this.setState({
            show:true
        });
        _animateHandlerHide.start && _animateHandlerHide.start()

    }

    show(shareObj) {
        this.setState(shareObj);
        this.setState({
            show:false
        });
        _animateHandlerShow.start && _animateHandlerShow.start();
    }

    _share(type) {
        let {actions}=this.props;
        switch (type) {
            case "QQ":
                MobService.shareQQ(this.state.shareObj.title, this.state.shareObj.content, this.state.shareObj.imagePath, this.state.shareObj.imageUrl).then(data=> {
                    if (data === 1) {
                        actions.toast("分享成功");
                    } else {
                        actions.toast("取消分享");
                    }
                }).catch(err=> {
                    actions.toast("分享失败");
                });
                break;
            case "Weixin":
                MobService.shareWeixin(this.state.shareObj.title, this.state.shareObj.content, this.state.shareObj.imagePath, this.state.shareObj.imageUrl).then(data=> {
                    if (data === 1) {
                        actions.toast("分享成功");
                    } else {
                        actions.toast("取消分享");
                    }
                }).catch(err=> {
                    actions.toast("分享失败");
                });
                break;
            case "weibo":
                MobService.shareWeibo(this.state.shareObj.content, this.state.shareObj.imagePath, this.state.shareObj.imageUrl).then(data=> {
                    if (data === 1) {
                        actions.toast("分享成功");
                    } else {
                        actions.toast("取消分享");
                    }
                }).catch(err=> {
                    actions.toast("分享失败");
                });
                break;
            case "Qzone":
                MobService.shareQzone(this.state.shareObj.title, this.state.shareObj.titleUrl, this.state.shareObj.content, this.state.shareObj.imagePath, this.state.shareObj.imageUrl).then(data=> {
                    if (data === 1) {
                        actions.toast("分享成功");
                    } else {
                        actions.toast("取消分享");
                    }
                }).catch(err=> {
                    actions.toast("分享失败");
                });
                break;
            case "pyq":
                MobService.sharePyq(this.state.shareObj.content, this.state.shareObj.imagePath, this.state.shareObj.imageUrl).then(data=> {
                    if (data == 1) {
                        actions.toast("分享成功");
                    } else {
                        actions.toast("取消分享");
                    }
                }).catch(err=> {
                    actions.toast("分享失败");
                });
                break;
            default:
                actions.toast("分享失败");
                break;
        }


    }

    componentDidMount() {
        this.state.bounceValue.setValue(0);     // 设置一个较大的初始值
        _animateHandlerShow = Animated.spring(this.state.bounceValue, {
            toValue: -topHeight,
            friction: 6,
            tension: 35
        });
        _animateHandlerHide = Animated.spring(this.state.bounceValue, {
            toValue: 0,
            friction: 10,
            tension: 35
        });

    }


    render() {
        return (
            <Animated.View style={[styles.container,{transform: [{translateY: this.state.bounceValue}]}]}>

                <View style={styles.shareItem}>
                    <Text style={[styles.shareItemText,{color:"#ccc",fontSize:14}]}>选择分享对象</Text>
                </View>
                <TouchableOpacity onPress={()=>{
                    this._share("QQ");
                }}>
                    <View style={styles.shareItem}>
                        <Text style={styles.shareItemText}>QQ好友</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{
                    this._share("Weixin")
                }}>
                    <View style={styles.shareItem}>
                        <Text style={styles.shareItemText}>微信好友</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{
                    this._share("pyq")
                }}>
                    <View style={styles.shareItem}>
                        <Text style={styles.shareItemText}>微信朋友圈</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{
                    this._share("weibo")
                }}>
                    <View style={styles.shareItem}>
                        <Text style={styles.shareItemText}>新浪微博</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{
                    this.hide();
                }}>
                    <View style={[styles.shareItem]}>
                        <Text style={[styles.shareItemText,{color:"#303030",fontSize:16,fontWeight: "bold"}]}>取消</Text>
                    </View>
                </TouchableOpacity>
            </Animated.View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: '#fff',
        flex: 1,
        justifyContent: 'center',
        position: "absolute", left: 0, bottom: -300,
        width: width, height: 300
    },
    shareItem: {
        flex: 1,
        backgroundColor: "#fff",
        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: "#f1f1f1",
        height: 50,
        flexDirection: "column",
        lineHeight: 100,
        justifyContent: "center",
        alignItems: "center",
        width: width
    },
    shareItemText: {
        color: "#404040",
        fontSize: 15,
    }
});
