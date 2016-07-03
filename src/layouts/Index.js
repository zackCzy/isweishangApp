import React,{Component,PropTypes} from 'react';
import  {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Animated,
    Easing,
    StatusBar,
    ScrollView,
    Image,
    requireNativeComponent
} from 'react-native';
import Bannel from '../components/Bannel';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from '../components/Header';
import Lightbox from 'react-native-lightbox';
import Parallax from 'react-native-parallax';
import ImageZoom from 'react-native-image-zoom';
import {NativeModules} from 'react-native';
const {MyIntentModule,MobShare}=NativeModules;

var iface = {
    name: 'LevtView',
    propTypes: {
        ...View.propTypes
    }

};
var iface2 = {
    name: 'ImageView',
    propTypes: {
        url: PropTypes.string,
        mTitle: PropTypes.string,
        type: PropTypes.number,
        ...View.propTypes // 包含默认的View的属性
    },
}
const LetvView= requireNativeComponent('RtcVedio', iface);



//const VideoView= requireNativeComponent('RCTJjVideoViewManager', iface2);

/*
 <LetvView
 style={{flex:1,height:300}}
 />
<VideoView
                        style={{flex:1,height:300}}
                        url="http://7xr5j6.com1.z0.glb.clouddn.com/hunantv0129.mp4?v=3"
                        mTitle="hahaha"
                        type={0}
                    />
*/
const {height, width} = Dimensions.get('window');
export default class Index extends Component {
    constructor(props) {
        super(props);
        const {actions} = props;

        actions.getHomeBannel();
    }

    _onPress() {
        const {router} = this.props;
        if (router) {
            router.toHtml();
        }
    }

    _onHomePress() {
        const {router} = this.props;
        if (router) {
            router.toHome();
        }
    }

    scrollToTop() {
        this._listView.scrollTo({
            x: 0,
            y: 0
        });
    }

    render() {
        //MyIntentModule.startActivityByString("com.isweishang.activity.VedioActivity");

        const {bannelData,router,user,message} = this.props;
        const Right = <Icon
            name='ios-menu'
            size={34}
            color='rgba(255,255,255,0.9)'
            style={styles.icon} onPress={this._onPress.bind(this)}
        />
        return (
            <View style={styles.container}>

                <Header
                    user={user}
                    router={router}
                    message={message}
                    text={"爱微购"}
                    Right={
						{
							text:Right
						}
					}
                    onPress={
							()=> {
								this.scrollToTop();
							}
					}
                />
                             
                <Parallax.ScrollView ref={view=>this._listView=view}>

                    <Bannel bannelData={bannelData}></Bannel>


                    <View style={styles.na_box}>
                        <View style={styles.item} onPress={this._onPress.bind(this)}>
                            <Icon
                                name='ios-time'
                                size={34}
                                color='rgba(231,65,69,0.9)'
                                style={styles.icon} onPress={this._onPress.bind(this)}/>
                            <Text style={styles.itemText}>最新推荐</Text>
                        </View>
                        <View style={styles.item} onPress={this._onHomePress.bind(this)}>
                            <Icon
                                name='md-easel'
                                size={34}
                                color='rgba(231,65,69,0.9)'
                                style={styles.icon} onPress={this._onHomePress.bind(this)}/>
                            <Text style={styles.itemText}>直播</Text>
                        </View>
                        <View style={styles.item} onPress={this._onPress.bind(this)}>
                            <Icon
                                name='ios-time'
                                size={34}
                                color='rgba(231,65,69,0.9)'
                                style={styles.icon} onPress={this._onPress.bind(this)}/>
                            <Text style={styles.itemText}>频道专题</Text>
                        </View>
                    </View>
                    <View style={styles.chanelWrap}>
                        <Text style={styles.chanelHeader}>
                            专题推荐
                        </Text>

                        <Parallax.Image
                            style={{ height: 200 }}
                            overlayStyle={{ backgroundColor: 'rgba(0,0,0,0.3)'}}
                            source={{ uri: 'http://c.hiphotos.baidu.com/image/w%3D310/sign=0dff10a81c30e924cfa49a307c096e66/7acb0a46f21fbe096194ceb468600c338644ad43.jpg' }}
                        >
                            <Text>This is optional overlay content</Text>
                        </Parallax.Image>
                        <Parallax.Image
                            style={{ height: 200 }}
                            overlayStyle={{ backgroundColor: 'rgba(0,0,0,0.3)'}}
                            source={{ uri: 'http://c.hiphotos.baidu.com/image/w%3D310/sign=0dff10a81c30e924cfa49a307c096e66/7acb0a46f21fbe096194ceb468600c338644ad43.jpg' }}
                        >
                            <Text>This is optional overlay content</Text>
                        </Parallax.Image>
                        <Parallax.Image
                            style={{ height: 200 }}
                            overlayStyle={{ backgroundColor: 'rgba(0,0,0,0.3)'}}
                            source={{ uri: 'http://c.hiphotos.baidu.com/image/w%3D310/sign=0dff10a81c30e924cfa49a307c096e66/7acb0a46f21fbe096194ceb468600c338644ad43.jpg' }}
                        >
                            <Text>This is optional overlay content</Text>
                        </Parallax.Image>
                    </View>

                </Parallax.ScrollView>
            </View>
        );
    };

}
const styles = StyleSheet.create({

    container: {
        flex: 1
    },
    itemText: {
        color: "rgb(137,137,137)",
        paddingTop: 5,
    },
    na_box: {
        paddingTop: 8,
        paddingBottom: 10,
        flexDirection: "row",
        marginTop: 30,
        backgroundColor: "#fff"
    },
    item: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    bg: {
        width,
        height,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    chanelWrap: {
        flex: 1,
        backgroundColor: "#fff"
    },
    chanelHeader: {
        backgroundColor: "rgba(234,234,234,0.7)",
        paddingTop: 10,
        paddingBottom: 10,
        fontSize: 18,
        marginTop: 10,
        paddingLeft: 10
    },
    chanelItem: {
        paddingTop: 8,
        paddingLeft: 8,
        paddingRight: 15
    },
    changeImg: {
        height: height * 0.25,
        paddingLeft: 8,
        width: width - 16
    }

});
export const LayoutComponent = Index;
export function mapStateToProps(state) {
    return {
        bannelData: state.home.bannelData,
        user: state.user,
        message: state.message,
    };
}
